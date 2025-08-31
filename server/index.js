require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const database = require('./database/postgres-connection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chat');
const scheduleRoutes = require('./routes/schedule');
const { initializeSocket } = require('./socket');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5173",
        "http://localhost:3000"
      ];
      
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        const cleanOrigin = origin.replace(/\/$/, '');
        const cleanAllowed = allowedOrigin.replace(/\/$/, '');
        return cleanOrigin === cleanAllowed;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Remove trailing slashes for comparison
      const cleanOrigin = origin.replace(/\/$/, '');
      const cleanAllowed = allowedOrigin.replace(/\/$/, '');
      return cleanOrigin === cleanAllowed;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));



// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/users', userRoutes.router);
app.use('/api/matches', matchRoutes.router);
app.use('/api/chat', chatRoutes.router);
app.use('/api/schedule', scheduleRoutes.router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize Socket.IO
initializeSocket(io);

const PORT = process.env.PORT || 3001;

// Initialize database connection before starting server
database.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔌 Socket.IO initialized`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

module.exports = app;
