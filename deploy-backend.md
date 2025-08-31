# 🚀 Backend Deployment on Railway

## Prerequisites
- GitHub account
- Railway account (free at railway.app)

## Step 1: Prepare Your Code
1. Make sure all your changes are committed to GitHub
2. Ensure your start script works: `npm start`

## Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js app

## Step 3: Set Environment Variables
In your Railway project, go to Variables tab and add:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Step 4: Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically add `DATABASE_URL` to your environment variables
4. Copy the `DATABASE_URL` value

## Step 5: Update Environment Variables
Add the `DATABASE_URL` from step 4 to your environment variables.

## Step 6: Deploy
1. Railway will automatically deploy your app
2. Wait for deployment to complete
3. Your backend will be available at: `https://your-project.railway.app`

## Step 7: Initialize Database
1. Go to your Railway project
2. Click on the "Deployments" tab
3. Find your latest deployment
4. Click "View Logs"
5. Look for database connection messages

## Step 8: Test Your API
Test your endpoints:
- Health check: `https://your-project.railway.app/health`
- API base: `https://your-project.railway.app/api`

## ✅ Done!
Your backend is now deployed with PostgreSQL database!

## 🔧 Troubleshooting
- If database connection fails, check the `DATABASE_URL` format
- If CORS errors occur, verify `FRONTEND_URL` is correct
- Check Railway logs for any error messages
