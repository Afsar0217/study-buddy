const express = require('express');
const { body, validationResult } = require('express-validator');
const database = require('../database/connection');
const { verifyToken } = require('./auth');

const router = express.Router();

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
  }
  next();
};

// Get potential study buddies for the current user
router.get('/potential-buddies', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      major, 
      year, 
      subject, 
      location, 
      limit = 10,
      offset = 0 
    } = req.query;

    // Get current user's preferences and subjects
    const currentUser = await database.get(`
      SELECT major, year, location, latitude, longitude
      FROM users WHERE id = ?
    `, [userId]);

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build query to find potential buddies
    let whereConditions = [
      'u.id != ?',
      'u.id NOT IN (SELECT user2_id FROM matches WHERE user1_id = ?)',
      'u.id NOT IN (SELECT user1_id FROM matches WHERE user2_id = ?)'
    ];
    let params = [userId, userId, userId];

    // Add filters
    if (major && major !== 'any') {
      whereConditions.push('u.major = ?');
      params.push(major);
    }

    if (year && year !== 'any') {
      whereConditions.push('u.year = ?');
      params.push(year);
    }

    if (subject && subject !== 'any') {
      whereConditions.push('us.subject = ?');
    }

    if (location && location !== 'any') {
      whereConditions.push('u.location LIKE ?');
      params.push(`%${location}%`);
    }

    // Build the main query
    let query = `
      SELECT DISTINCT 
        u.id, u.name, u.university, u.major, u.year, u.bio, u.avatar, u.location,
        u.latitude, u.longitude, u.created_at,
        GROUP_CONCAT(DISTINCT us.subject) as subjects,
        GROUP_CONCAT(DISTINCT CONCAT(ust.day_of_week, ':', ust.start_time, '-', ust.end_time)) as study_times
      FROM users u
      LEFT JOIN user_subjects us ON u.id = us.user_id
      LEFT JOIN user_study_times ust ON u.id = ust.user_id
    `;

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += `
      GROUP BY u.id
      ORDER BY 
        CASE 
          WHEN u.major = ? THEN 1
          WHEN u.year = ? THEN 2
          ELSE 3
        END,
        u.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(currentUser.major || '', currentUser.year || '', parseInt(limit), parseInt(offset));

    const potentialBuddies = await database.all(query, params);

    // Format the results
    const formattedBuddies = potentialBuddies.map(buddy => {
      const subjects = buddy.subjects ? buddy.subjects.split(',') : [];
      const studyTimes = buddy.study_times ? buddy.study_times.split(',').map(time => {
        const [day, timeRange] = time.split(':');
        return { day, time: timeRange };
      }) : [];

      // Calculate distance if coordinates are available
      let distance = null;
      if (currentUser.latitude && currentUser.longitude && buddy.latitude && buddy.longitude) {
        distance = calculateDistance(
          currentUser.latitude, currentUser.longitude,
          buddy.latitude, buddy.longitude
        );
      }

      return {
        ...buddy,
        subjects,
        studyTimes,
        distance: distance ? `${distance.toFixed(1)} miles away` : null
      };
    });

    res.json({
      potentialBuddies: formattedBuddies,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: formattedBuddies.length
      }
    });

  } catch (error) {
    console.error('Get potential buddies error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching potential buddies' 
    });
  }
});

// Handle swipe (like/dislike)
router.post('/swipe', verifyToken, [
  body('targetUserId').notEmpty(),
  body('action').isIn(['like', 'dislike']),
  validateRequest
], async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'Cannot swipe on yourself' });
    }

    // Check if already swiped
    const existingMatch = await database.get(`
      SELECT * FROM matches 
      WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    `, [currentUserId, targetUserId, targetUserId, currentUserId]);

    if (existingMatch) {
      return res.status(400).json({ error: 'Already swiped on this user' });
    }

    if (action === 'like') {
      // Check if target user has also liked current user
      const mutualLike = await database.get(`
        SELECT * FROM matches 
        WHERE user1_id = ? AND user2_id = ? AND status = 'pending'
      `, [targetUserId, currentUserId]);

      if (mutualLike) {
        // It's a match!
        const matchId = require('uuid').v4();
        
        // Update existing match to confirmed
        await database.run(`
          UPDATE matches SET status = 'confirmed', matched_at = CURRENT_TIMESTAMP
          WHERE user1_id = ? AND user2_id = ?
        `, [targetUserId, currentUserId]);

        // Create conversation
        const conversationId = require('uuid').v4();
        await database.run(`
          INSERT INTO conversations (id, user1_id, user2_id, created_at, last_message_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [conversationId, currentUserId, targetUserId]);

        // Get target user info
        const targetUser = await database.get(`
          SELECT id, name, avatar FROM users WHERE id = ?
        `, [targetUserId]);

        res.json({
          message: 'It\'s a match!',
          isMatch: true,
          match: {
            id: matchId,
            user: targetUser,
            conversationId
          }
        });
      } else {
        // Create pending match
        const matchId = require('uuid').v4();
        await database.run(`
          INSERT INTO matches (id, user1_id, user2_id, status, matched_at)
          VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP)
        `, [matchId, currentUserId, targetUserId]);

        res.json({
          message: 'Like recorded',
          isMatch: false
        });
      }
    } else {
      // Record dislike (optional - you might want to track this for better matching)
      res.json({
        message: 'Dislike recorded',
        isMatch: false
      });
    }

  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ 
      error: 'Internal server error while processing swipe' 
    });
  }
});

// Get current user's matches
router.get('/my-matches', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const matches = await database.all(`
      SELECT 
        m.id, m.status, m.matched_at,
        CASE 
          WHEN m.user1_id = ? THEN m.user2_id
          ELSE m.user1_id
        END as other_user_id,
        u.name, u.avatar, u.major, u.year, u.university
      FROM matches m
      JOIN users u ON (
        CASE 
          WHEN m.user1_id = ? THEN m.user2_id
          ELSE m.user1_id
        END = u.id
      )
      WHERE (m.user1_id = ? OR m.user2_id = ?) AND m.status = 'confirmed'
      ORDER BY m.matched_at DESC
    `, [userId, userId, userId, userId]);

    // Get conversation info for each match
    const matchesWithConversations = await Promise.all(
      matches.map(async (match) => {
        const conversation = await database.get(`
          SELECT id, last_message_at FROM conversations
          WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
        `, [userId, match.other_user_id, match.other_user_id, userId]);

        return {
          ...match,
          conversationId: conversation?.id || null,
          lastMessageAt: conversation?.last_message_at || null
        };
      })
    );

    res.json({
      matches: matchesWithConversations
    });

  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching matches' 
    });
  }
});

// Get pending matches (users who liked current user)
router.get('/pending-matches', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const pendingMatches = await database.all(`
      SELECT 
        m.id, m.matched_at,
        u.id as user_id, u.name, u.avatar, u.major, u.year, u.university, u.bio
      FROM matches m
      JOIN users u ON m.user1_id = u.id
      WHERE m.user2_id = ? AND m.status = 'pending'
      ORDER BY m.matched_at DESC
    `, [userId]);

    res.json({
      pendingMatches
    });

  } catch (error) {
    console.error('Get pending matches error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching pending matches' 
    });
  }
});

// Accept or reject a pending match
router.post('/respond-to-match', verifyToken, [
  body('matchId').notEmpty(),
  body('response').isIn(['accept', 'reject']),
  validateRequest
], async (req, res) => {
  try {
    const { matchId, response } = req.body;
    const currentUserId = req.user.userId;

    // Get the match
    const match = await database.get(`
      SELECT * FROM matches WHERE id = ? AND user2_id = ? AND status = 'pending'
    `, [matchId, currentUserId]);

    if (!match) {
      return res.status(404).json({ error: 'Match not found or not pending' });
    }

    if (response === 'accept') {
      // Accept the match
      await database.run(`
        UPDATE matches SET status = 'confirmed', matched_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [matchId]);

      // Create conversation
      const conversationId = require('uuid').v4();
      await database.run(`
        INSERT INTO conversations (id, user1_id, user2_id, created_at, last_message_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [conversationId, match.user1_id, match.user2_id]);

      // Get the other user's info
      const otherUser = await database.get(`
        SELECT id, name, avatar FROM users WHERE id = ?
      `, [match.user1_id]);

      res.json({
        message: 'Match accepted!',
        isMatch: true,
        match: {
          id: matchId,
          user: otherUser,
          conversationId
        }
      });
    } else {
      // Reject the match
      await database.run(`
        UPDATE matches SET status = 'rejected'
        WHERE id = ?
      `, [matchId]);

      res.json({
        message: 'Match rejected',
        isMatch: false
      });
    }

  } catch (error) {
    console.error('Respond to match error:', error);
    res.status(500).json({ 
      error: 'Internal server error while responding to match' 
    });
  }
});

// Unmatch a user
router.post('/unmatch', verifyToken, [
  body('otherUserId').notEmpty(),
  validateRequest
], async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user.userId;

    // Update match status to unmatched
    await database.run(`
      UPDATE matches SET status = 'unmatched'
      WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    `, [currentUserId, otherUserId, otherUserId, currentUserId]);

    res.json({
      message: 'User unmatched successfully'
    });

  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ 
      error: 'Internal server error while unmatching user' 
    });
  }
});

// Get match statistics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Total matches
    const totalMatches = await database.get(`
      SELECT COUNT(*) as count FROM matches 
      WHERE (user1_id = ? OR user2_id = ?) AND status = 'confirmed'
    `, [userId, userId]);

    // Pending matches
    const pendingMatches = await database.get(`
      SELECT COUNT(*) as count FROM matches 
      WHERE user2_id = ? AND status = 'pending'
    `, [userId]);

    // Total swipes given
    const totalSwipes = await database.get(`
      SELECT COUNT(*) as count FROM matches 
      WHERE user1_id = ?
    `, [userId]);

    res.json({
      stats: {
        totalMatches: totalMatches.count || 0,
        pendingMatches: pendingMatches.count || 0,
        totalSwipes: totalSwipes.count || 0
      }
    });

  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching match statistics' 
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = { router };
