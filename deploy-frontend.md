# 🚀 Frontend Deployment on Vercel

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

## Step 1: Prepare Your Code
1. Make sure all your changes are committed to GitHub
2. Ensure your build script works: `npm run build`

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

## Step 3: Set Environment Variables
In your Vercel project settings, add these environment variables:
```
VITE_API_URL=https://study-buddy-backend-ix9h.onrender.com/api
VITE_SOCKET_URL=https://study-buddy-backend-ix9h.onrender.com
```

## Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at: `https://your-project.vercel.app`

## Step 5: Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Update your backend CORS settings with the new domain

## ✅ Done!
Your frontend is now deployed and will automatically redeploy on every GitHub push!
