const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        // Use DATABASE_URL from environment or fallback to local SQLite
        const databaseUrl = process.env.DATABASE_URL;
        
        if (databaseUrl && databaseUrl.startsWith('postgresql://')) {
          // PostgreSQL connection
          this.pool = new Pool({
            connectionString: databaseUrl,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          });

          // Test the connection
          this.pool.query('SELECT NOW()', (err, result) => {
            if (err) {
              console.error('❌ Error connecting to PostgreSQL:', err);
              reject(err);
            } else {
              console.log('✅ Connected to PostgreSQL database');
              this.isConnected = true;
              resolve();
            }
          });
        } else {
          // Fallback to SQLite for local development only
          if (process.env.NODE_ENV === 'development') {
            try {
              console.log('📝 Using SQLite for local development');
              const sqlite3 = require('sqlite3').verbose();
              const path = require('path');
              
              this.dbPath = path.join(__dirname, 'study_buddy.db');
              this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                  console.error('❌ Error connecting to SQLite:', err);
                  reject(err);
                } else {
                  console.log('✅ Connected to SQLite database');
                  this.db.run('PRAGMA foreign_keys = ON');
                  this.isConnected = true;
                  resolve();
                }
              });
            } catch (sqliteError) {
              console.error('❌ SQLite not available:', sqliteError.message);
              reject(new Error('SQLite not available in production environment'));
            }
          } else {
            reject(new Error('DATABASE_URL is required in production environment'));
          }
        }
      } catch (error) {
        console.error('❌ Database connection error:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.pool) {
        this.pool.end((err) => {
          if (err) {
            console.error('❌ Error closing PostgreSQL connection:', err);
            reject(err);
          } else {
            console.log('🔒 PostgreSQL connection closed');
            this.pool = null;
            this.isConnected = false;
            resolve();
          }
        });
      } else if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing SQLite connection:', err);
            reject(err);
          } else {
            console.log('🔒 SQLite connection closed');
            this.db = null;
            this.isConnected = false;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Execute a query with parameters (for both PostgreSQL and SQLite)
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (this.pool) {
        // PostgreSQL
        this.pool.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: result.rows[0]?.id || result.insertId,
              changes: result.rowCount
            });
          }
        });
      } else if (this.db) {
        // SQLite
        this.db.run(sql, params, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              changes: this.changes
            });
          }
        });
      } else {
        reject(new Error('Database not connected'));
      }
    });
  }

  // Get a single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (this.pool) {
        // PostgreSQL
        this.pool.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows[0] || null);
          }
        });
      } else if (this.db) {
        // SQLite
        this.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      } else {
        reject(new Error('Database not connected'));
      }
    });
  }

  // Get multiple rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      if (this.pool) {
        // PostgreSQL
        this.pool.query(sql, params, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.rows || []);
          }
        });
      } else if (this.db) {
        // SQLite
        this.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        reject(new Error('Database not connected'));
      }
    });
  }

  // Execute a transaction
  transaction(callback) {
    return new Promise(async (resolve, reject) => {
      if (this.pool) {
        // PostgreSQL transaction
        const client = await this.pool.connect();
        try {
          await client.query('BEGIN');
          const result = await callback(client);
          await client.query('COMMIT');
          resolve(result);
        } catch (error) {
          await client.query('ROLLBACK');
          reject(error);
        } finally {
          client.release();
        }
      } else if (this.db) {
        // SQLite transaction
        this.db.serialize(() => {
          this.db.run('BEGIN TRANSACTION');
          try {
            const result = callback(this.db);
            this.db.run('COMMIT');
            resolve(result);
          } catch (error) {
            this.db.run('ROLLBACK');
            reject(error);
          }
        });
      } else {
        reject(new Error('Database not connected'));
      }
    });
  }
}

module.exports = new Database();
