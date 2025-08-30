  # Virtual Study Buddy Finder

A comprehensive platform for students to find study partners, schedule study sessions, and collaborate on academic work. Built with React, TypeScript, Node.js, and SQLite.

## 🚀 Features

### Core Functionality
- **User Authentication & Profiles**: Secure login/signup with JWT tokens
- **My Profile Management**: Comprehensive profile editing with subjects, study times, and preferences
- **Study Buddy Matching**: Swipe-based matching system with intelligent algorithms
- **Real-time Chat**: Instant messaging with Socket.IO
- **Study Session Management**: Create, join, and manage study sessions
- **Smart Scheduling**: Conflict-free scheduling with calendar integration
- **Rating System**: Rate study partners after sessions
- **Search & Filters**: Find study buddies by major, year, subjects, and location

### Technical Features
- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Mobile-first approach with touch gestures
- **Real-time Updates**: Live notifications and status updates
- **Secure Backend**: JWT authentication, input validation, and rate limiting
- **Database**: SQLite with proper indexing and relationships
- **API**: RESTful API with comprehensive endpoints

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Motion** for animations
- **Axios** for API calls
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express
- **SQLite** database
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd virtual-study-buddy-finder
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Initialize Database
```bash
cd server
npm run db:init
cd ..
```

### 4. Start the Development Servers

#### Option 1: Start Both Servers (Recommended)
```bash
npm run dev:full
```

#### Option 2: Start Servers Separately
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📁 Project Structure

```
virtual-study-buddy-finder/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── AuthScreen.tsx      # Authentication screens
│   │   ├── MainDashboard.tsx   # Main app dashboard
│   │   ├── ChatInterface.tsx   # Chat functionality
│   │   └── ScheduleSystem.tsx  # Study session management
│   ├── services/               # API services
│   │   └── api.ts             # Backend API integration
│   └── styles/                 # CSS and styling
├── server/                      # Backend server code
│   ├── database/               # Database files
│   │   ├── connection.js       # Database connection utility
│   │   └── init.js            # Database initialization
│   ├── routes/                 # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   ├── matches.js         # Matching system routes
│   │   ├── chat.js            # Chat functionality routes
│   │   └── schedule.js        # Study session routes
│   ├── socket.js              # Socket.IO implementation
│   ├── index.js               # Main server file
│   └── package.json           # Backend dependencies
├── package.json                # Frontend dependencies
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database Configuration
# SQLite database file will be created automatically

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Database Configuration

The application uses SQLite by default. The database file (`study_buddy.db`) will be created automatically in the `server/database/` directory when you run the initialization script.

## 📊 Database Schema

The application includes the following main tables:

- **users**: User profiles and authentication
- **user_subjects**: User's study subjects and proficiency levels
- **user_study_times**: User's available study times
- **matches**: User matching relationships
- **conversations**: Chat conversations between users
- **messages**: Individual chat messages
- **study_sessions**: Study session details
- **session_participants**: Users participating in sessions
- **session_ratings**: Ratings and feedback for sessions

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users/:userId` - Get public user profile
- `GET /api/users/me/profile` - Get current user's full profile
- `PUT /api/users/me/subjects` - Update user subjects
- `PUT /api/users/me/study-times` - Update study times
- `GET /api/users/search` - Search for users

### Matching
- `GET /api/matches/potential-buddies` - Get potential study buddies
- `POST /api/matches/swipe` - Like/dislike a user
- `GET /api/matches/my-matches` - Get user's matches
- `GET /api/matches/pending-matches` - Get pending match requests

### Chat
- `GET /api/chat/conversations` - Get user's conversations
- `GET /api/chat/conversations/:id/messages` - Get conversation messages
- `POST /api/chat/conversations/:id/messages` - Send a message
- `POST /api/chat/conversations` - Create new conversation

### Study Sessions
- `POST /api/schedule/sessions` - Create study session
- `GET /api/schedule/sessions` - Get user's sessions
- `POST /api/schedule/sessions/:id/join` - Join a session
- `POST /api/schedule/sessions/:id/cancel` - Cancel a session

## 🧪 Testing

### Sample Data

The database initialization script creates sample users for testing:

- **Emma Thompson** (emma@example.com) - Computer Science Junior
- **Marcus Johnson** (marcus@example.com) - Mathematics Senior  
- **Sofia Rodriguez** (sofia@example.com) - Biology Sophomore

All sample users have the password: `password123`

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Update all environment variables for production
2. **JWT Secret**: Use a strong, unique JWT secret
3. **Database**: Consider using PostgreSQL for production
4. **File Storage**: Use cloud storage (AWS S3, Google Cloud) for file uploads
5. **HTTPS**: Enable HTTPS in production
6. **Rate Limiting**: Adjust rate limiting based on expected traffic
7. **Monitoring**: Add logging and monitoring solutions

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the database is properly initialized
4. Check that both frontend and backend servers are running
5. Verify environment variables are set correctly

## 🔮 Future Enhancements

- **Video Chat Integration**: Built-in video calling for study sessions
- **File Sharing**: Share study materials and notes
- **Study Groups**: Create and manage study groups
- **Progress Tracking**: Track study goals and achievements
- **Mobile App**: Native mobile applications
- **AI Matching**: Machine learning-based matching algorithm
- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Notifications**: Push notifications and email reminders

## 📞 Contact

For questions or support, please open an issue in the repository.

---

**Happy Studying! 📚✨**
  