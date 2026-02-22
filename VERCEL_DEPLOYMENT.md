# Vercel Deployment Guide

This guide explains how to deploy the DMLess project to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com) (sign up with GitHub)
- Repository pushed to GitHub
- MongoDB Atlas connection string

## Setup Steps

### 1. Prepare MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Create a database user and get your connection string
4. Format your connection string:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/dbname?retryWrites=true&w=majority
   ```
5. **Important**: Add all Vercel IPs to your IP Whitelist in MongoDB Atlas (use 0.0.0.0/0 for development)

### 2. Deploy Backend to Vercel

#### Option A: Backend-Only Deployment

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your `dmless` repository from GitHub
4. Configure:
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)
5. Click **"Environment Variables"** and add:
   - **Name**: `MONGO_URL`
   - **Value**: Your MongoDB connection string
6. Click **"Deploy"**
7. After deployment, copy your backend URL (e.g., `https://dmless-api.vercel.app`)

### 3. Deploy Frontend to Vercel

#### Option A: Frontend-Only Deployment

1. Create a new Vercel project from the same repository
2. Configure:
   - **Root Directory**: `fronted` (or rename folder to `frontend` first)
   - **Build Command**: `echo "Static site"`
   - **Output Directory**: (leave empty)
3. Deploy

#### Update Frontend API URL

After backend is deployed, update:

**File**: `fronted/js/script.js` (line 1-5)

```javascript
// Detect environment and set API URL
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API = isLocalhost 
  ? 'http://localhost:5000/api' 
  : 'https://YOUR_BACKEND_URL.vercel.app/api';  // ← Replace with your backend URL
```

4. Push changes to GitHub
5. Vercel will auto-redeploy

### 4. Deploy Full Stack (Optional - Monorepo)

If you want both frontend and backend in a single Vercel project:

1. Create new Vercel project from repository
2. Skip the configuration (Vercel will auto-detect)
3. Vercel will use the root `vercel.json` which is already configured
4. Add `MONGO_URL` in Environment Variables
5. Deploy

This will serve both frontend and backend under one domain.

## Vercel Configuration Files Explained

### `/backend/vercel.json`
Configures Node.js serverless functions for API routes:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

### `/vercel.json` (Root)
Configures monorepo deployment with both frontend and backend:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/fronted/$1"
    }
  ]
}
```

## Environment Variables in Vercel

Go to **Project Settings** → **Environment Variables**:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGO_URL` | Your MongoDB connection string | ✅ Yes |

## Testing Deployment

After deployment:

1. **Test Backend**: Open `https://YOUR_BACKEND_URL.vercel.app/api/health`
   - Should return `{"status":"OK"}`

2. **Test Frontend**: Open `https://YOUR_FRONTEND_URL/register.html`
   - Should load without errors
   - Console should show API URL is set correctly

3. **Test API Connection**: Try registering a new user
   - Check browser console for errors
   - Monitor MongoDB Atlas for new documents

## Troubleshooting

### Backend Won't Deploy
- Check `backend/package.json` has all dependencies listed
- Verify `backend/api/*.js` files are present
- Check error logs in Vercel dashboard

### API calls return 404
- Verify `MONGO_URL` is set in environment variables
- Check MongoDB connection string format
- Ensure MongoDB database `dmless` exists

### Frontend can't connect to backend
- Verify backend URL in `fronted/js/script.js` is correct
- Check CORS is working (no CORS errors in console)
- Verify backend is deployed and `/api/health` returns OK

### MongoDB connection fails
- Add Vercel IP range to MongoDB Atlas whitelist
- Check connection string format
- Verify username and password are correct
- Ensure database user has appropriate permissions

## Continuous Deployment

Once deployed, Vercel will automatically:
- Deploy new code when you push to GitHub
- Use the same environment variables
- Maintain your custom domain (if configured)

To disable auto-deployment:
- Go to **Project Settings** → **Build & Deployment**
- Turn off **Auto-deploy on Push**

## Custom Domain (Optional)

1. In Vercel project settings
2. Go to **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Monitoring & Analytics

Monitor your deployments in Vercel Dashboard:
- Deployment history
- Function logs
- Analytics
- Environment variables

## Next Steps After Deployment

1. ✅ Test all functionality on deployed URLs
2. ✅ Share your application URL with others
3. ✅ Monitor MongoDB usage
4. ✅ Set up error monitoring (optional)
5. ✅ Configure custom domain (optional)

---

**Quick Reference:**
- Backend Health: `https://YOUR_BACKEND.vercel.app/api/health`
- Frontend: `https://YOUR_FRONTEND.vercel.app`
- Full Stack: `https://YOUR_PROJECT.vercel.app`
