@echo off
echo 🧪 Virtual Study Buddy Finder - Quick Test Script
echo ================================================

echo.
echo 📋 Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available
    pause
    exit /b 1
) else (
    echo ✅ npm is available
)

echo.
echo 🔧 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🗄️ Initializing database...
cd server
npm run db:init
if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)
cd ..

echo.
echo 🏗️ Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ All checks passed!
echo.
echo 🚀 Starting development servers...
echo.
echo 📱 Frontend will be available at: http://localhost:5173
echo 🔧 Backend will be available at: http://localhost:3001
echo.
echo 💡 Testing Tips:
echo 1. Open http://localhost:5173 in your browser
echo 2. Use the sample users from README.md for testing
echo 3. Check browser console for any errors
echo 4. Follow TESTING_GUIDE.md for comprehensive testing
echo.
echo Press any key to start the servers...
pause >nul

echo.
echo 🚀 Starting servers...
npm run dev:full
