const database = require('./database/postgres-connection');
const { createTables } = require('./database/postgres-init');

async function checkAndInitializeDatabase() {
  try {
    console.log('🔍 Checking database connection...');
    await database.connect();
    
    console.log('🔍 Checking if tables exist...');
    
    // Try to query the users table to see if it exists
    try {
      await database.get('SELECT COUNT(*) as count FROM users');
      console.log('✅ Database tables already exist');
    } catch (error) {
      console.log('❌ Tables not found, creating them...');
      await createTables();
      console.log('✅ Database tables created successfully');
    }
    
    console.log('🎉 Database check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  }
}

// Run the check
checkAndInitializeDatabase();
