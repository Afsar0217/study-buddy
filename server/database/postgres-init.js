const database = require('./postgres-connection');

const createTables = async () => {
  try {
    console.log('🚀 Starting PostgreSQL database initialization...');

    // Users table
    await database.run(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        university VARCHAR(255),
        major VARCHAR(255),
        year VARCHAR(50),
        bio TEXT,
        avatar VARCHAR(500),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // User subjects table
    await database.run(`
      CREATE TABLE IF NOT EXISTS user_subjects (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        subject VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ User subjects table created/verified');

    // User study times table
    await database.run(`
      CREATE TABLE IF NOT EXISTS user_study_times (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        day VARCHAR(20) NOT NULL,
        time VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ User study times table created/verified');

    // Matches table
    await database.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id UUID PRIMARY KEY,
        user1_id UUID NOT NULL,
        user2_id UUID NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user1_id, user2_id)
      )
    `);
    console.log('✅ Matches table created/verified');

    // Conversations table
    await database.run(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY,
        user1_id UUID NOT NULL,
        user2_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user1_id, user2_id)
      )
    `);
    console.log('✅ Conversations table created/verified');

    // Messages table
    await database.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY,
        conversation_id UUID NOT NULL,
        sender_id UUID NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_at TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Messages table created/verified');

    // Study sessions table
    await database.run(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id UUID PRIMARY KEY,
        creator_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(255),
        max_participants INTEGER DEFAULT 10,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        location VARCHAR(255),
        is_virtual BOOLEAN DEFAULT false,
        meeting_link VARCHAR(500),
        status VARCHAR(20) DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Study sessions table created/verified');

    // Study session participants table
    await database.run(`
      CREATE TABLE IF NOT EXISTS study_session_participants (
        id UUID PRIMARY KEY,
        session_id UUID NOT NULL,
        user_id UUID NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES study_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(session_id, user_id)
      )
    `);
    console.log('✅ Study session participants table created/verified');

    // Create indexes for better performance
    await database.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_conversations_users ON conversations(user1_id, user2_id)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_study_sessions_creator ON study_sessions(creator_id)');
    await database.run('CREATE INDEX IF NOT EXISTS idx_study_sessions_time ON study_sessions(start_time, end_time)');

    console.log('✅ Database indexes created/verified');
    console.log('🎉 PostgreSQL database initialization completed successfully!');

  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('✅ Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
