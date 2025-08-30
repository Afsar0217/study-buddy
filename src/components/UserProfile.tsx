import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  ArrowLeft, MapPin, Star, Calendar, MessageSquare, Heart, BookOpen, Clock, 
  Award, User, Settings, Activity, Trophy, Search, Users
} from 'lucide-react';
import { usersAPI } from '../services/api';

interface UserProfileProps {
  onBack: () => void;
  userId: string;
  onNavigate?: (screen: string) => void; // Add navigation prop
}

interface UserProfileData {
  id: string;
  name: string;
  university?: string;
  major?: string;
  year?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  created_at: string;
  subjects: Array<{
    subject: string;
    proficiency_level: string;
  }>;
  studyTimes: Array<{
    day_of_week: string;
    start_time: string;
    end_time: string;
  }>;
}

export function UserProfile({ onBack, userId, onNavigate }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load profile data
  useEffect(() => {
    loadProfile();
    loadLikeInfo();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getProfileById(userId);
      setProfile(response.user);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLikeInfo = async () => {
    try {
      const [likeCountResponse, likedResponse] = await Promise.all([
        usersAPI.getLikeCount(userId),
        usersAPI.checkIfLiked(userId)
      ]);
      setLikeCount(likeCountResponse.likeCount);
      setHasLiked(likedResponse.hasLiked);
    } catch (error) {
      console.error('Error loading like info:', error);
    }
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      if (hasLiked) {
        await usersAPI.unlikeUser(userId);
        setLikeCount(prev => prev - 1);
        setHasLiked(false);
      } else {
        await usersAPI.likeUser(userId);
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleMessage = () => {
    // Navigate to chat interface
    if (onNavigate) {
      onNavigate('chat');
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success popup
      setShowConnectionPopup(true);
      
      // Remove auto-hide - popup will stay until manually closed
      
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">User Profile</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">User Profile</h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load profile</p>
            <Button onClick={loadProfile} className="mt-2">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">User Profile</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl">
                    {profile.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.university}</p>
                  <div className="flex items-center mt-4 space-x-3">
                    {/* Message Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMessage}
                      className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </Button>
                    
                    {/* Connect Button */}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Users className="w-4 h-4" />
                      <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
                    </Button>
                    
                    {/* Like Button */}
                    <Button
                      variant={hasLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      disabled={isLiking}
                      className="flex items-center space-x-2"
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Major</p>
                  <p className="text-sm mt-1">{profile.major || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p className="text-sm mt-1">{profile.year || 'Not specified'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm mt-1">{profile.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bio</p>
                <p className="text-sm mt-1">{profile.bio || 'No bio yet'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Study Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Study Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.subjects?.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject.subject} ({subject.proficiency_level})
                  </Badge>
                ))}
                {(!profile.subjects || profile.subjects.length === 0) && (
                  <p className="text-muted-foreground">No subjects added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Study Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Study Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.studyTimes?.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="font-medium">{time.day_of_week}</span>
                    <span className="text-muted-foreground">
                      {time.start_time} - {time.end_time}
                    </span>
                  </div>
                ))}
                {(!profile.studyTimes || profile.studyTimes.length === 0) && (
                  <p className="text-muted-foreground">No study times scheduled yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Connection Success Popup */}
      {showConnectionPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConnectionPopup(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-green-500 relative"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white' }}
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Celebration Icon */}
              <div className="mb-4">
                <div className="text-5xl mb-3">🎉</div>
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Successfully Connected!
              </h2>
              
              {/* Description */}
              <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                You are now connected with <span className="font-bold text-green-600">{profile?.name}</span>! 
                You can now start chatting and collaborating on study sessions.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => {
                    setShowConnectionPopup(false);
                    handleMessage();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chatting Now
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowConnectionPopup(false)}
                  className="border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 text-sm"
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
