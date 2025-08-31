# 🚀 Deployment Checklist

## ✅ Pre-Deployment Tasks

### Frontend (Vercel)
- [ ] Code is committed to GitHub
- [ ] `npm run build` works locally
- [ ] Environment variables are ready
- [ ] API URLs are updated for production

### Backend (Railway)
- [ ] Code is committed to GitHub
- [ ] `npm start` works locally
- [ ] Environment variables are ready
- [ ] Database migration is tested
- [ ] File upload functionality removed

## 🚀 Deployment Steps

### 1. Backend First (Railway)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Add PostgreSQL database
- [ ] Set environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
  - [ ] `FRONTEND_URL=https://your-frontend.vercel.app`
  - [ ] `JWT_SECRET=your-secret-key`
  - [ ] `DATABASE_URL=postgresql://...`
- [ ] Deploy and test API endpoints
- [ ] Verify database connection

### 2. Frontend Second (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Set environment variables:
  - [ ] `VITE_API_URL=https://your-backend.railway.app/api`
  - [ ] `VITE_SOCKET_URL=https://your-backend.railway.app`
- [ ] Deploy and test functionality

## 🧪 Post-Deployment Testing

### Backend Tests
- [ ] Health check endpoint: `/health`
- [ ] API endpoints: `/api/auth/login`
- [ ] Database operations work
- [ ] CORS is properly configured
- [ ] Socket.IO connections work

### Frontend Tests
- [ ] App loads without errors
- [ ] Authentication works
- [ ] User registration works
- [ ] Chat functionality works
- [ ] Study session creation works
- [ ] Profile management works

### Integration Tests
- [ ] Frontend can connect to backend
- [ ] Real-time chat works
- [ ] User matching works
- [ ] Study sessions work end-to-end

## 🔧 Troubleshooting

### Common Issues
- [ ] CORS errors → Check `FRONTEND_URL` in backend
- [ ] Database connection fails → Verify `DATABASE_URL` format
- [ ] Build fails → Check Node.js version compatibility
- [ ] API calls fail → Verify environment variables

### Debug Steps
1. Check Railway logs for backend errors
2. Check Vercel build logs for frontend errors
3. Verify environment variables are set correctly
4. Test API endpoints with Postman/curl
5. Check browser console for frontend errors

## 📱 Final Verification

### URLs to Test
- [ ] Frontend: `https://your-app.vercel.app`
- [ ] Backend: `https://your-app.railway.app`
- [ ] Health Check: `https://your-app.railway.app/health`
- [ ] API Base: `https://your-app.railway.app/api`

### Functionality Checklist
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Study buddy matching
- [ ] Real-time chat
- [ ] Study session creation
- [ ] User search and discovery

## 🎉 Success!
Once all items are checked, your app is successfully deployed and ready for users!
