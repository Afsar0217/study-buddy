@echo off
echo 🚀 Setting up Virtual Study Buddy Finder...
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Initialize database
echo 🗄️  Initializing database...
call npm run db:init

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the development servers:
echo    npm run dev:full
echo.
echo 2. Or start servers separately:
echo    # Terminal 1 (Backend):
echo    cd server ^&^& npm run dev
echo    # Terminal 2 (Frontend):
echo    npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:3001
echo.
echo 🧪 Test accounts:
echo    Email: emma@example.com, Password: password123
echo    Email: marcus@example.com, Password: password123
echo    Email: sofia@example.com, Password: password123
echo.
echo Happy coding! 🚀
pause
