# 🚀 Quick Start Guide

## 30-Second Local Setup

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Update MongoDB connection
# Edit .env.local and add your MongoDB Atlas URL

# 3. Start the server
npm run dev

# 4. Open in browser
# http://localhost:5000
```

## 5-Minute Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Setup local dev and Vercel deployment"
   git push origin main
   ```

2. **Deploy Backend**
   - Go to [vercel.com](https://vercel.com)
   - New Project → Import `dmless`
   - Root Directory: `backend`
   - Add env var: `MONGO_URL` = your MongoDB URL
   - Deploy
   - Copy backend URL

3. **Update Frontend**
   - Edit `fronted/js/script.js` (line 4)
   - Replace `YOUR_BACKEND_URL` with your Vercel backend URL

4. **Deploy Frontend**
   - New Vercel project from same repo
   - Root Directory: `fronted`
   - Deploy

5. **Test**
   - Open frontend URL
   - Try registering a new user
   - Check MongoDB Atlas for new data

## 📋 What You Need

- ✅ MongoDB Atlas account (free tier available)
- ✅ GitHub account (already done)
- ✅ Vercel account (free, sign in with GitHub)

## 📍 Default Ports & URLs

**Local Development:**
- Frontend: http://localhost:5000
- API: http://localhost:5000/api
- Health: http://localhost:5000/api/health

**After Vercel Deployment:**
- Frontend: https://YOUR-FRONTEND-PROJECT.vercel.app
- Backend: https://YOUR-BACKEND-PROJECT.vercel.app/api

## 🔗 Important Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [Vercel Dashboard](https://vercel.com) - Deploy & monitor
- [GitHub](https://github.com) - Version control

## 📱 Features Available

After setup, you can:
- ✅ Register recruiter account
- ✅ Login with email/password
- ✅ Create job postings
- ✅ Generate shareable job link
- ✅ Share with candidates
- ✅ View test results
- ✅ See candidate stats

## ❌ Troubleshooting

**Server won't start:**
- Is `.env.local` set with valid MongoDB URL?
- Is port 5000 available?
- Run `npm install` again

**API calls fail:**
- Check MongoDB URL is correct
- Verify MongoDB user has write permissions
- Check IP whitelist in MongoDB Atlas

**Frontend can't find API:**
- Verify API URL in `fronted/js/script.js`
- Browser console should show actual API URL being used

## 📚 Full Documentation

- [README.md](./README.md) - Complete guide
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed deployment steps
- [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) - What was configured

---

**First time?** Start here: `cd backend && npm install && npm run dev`
