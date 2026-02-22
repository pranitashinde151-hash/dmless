# dmless - Smart Recruitment Platform

**dmless** is a modern recruitment platform that enables recruiters to create smart hiring links with MCQ-based screening, track candidates, and manage the recruitment process efficiently.

## Project Structure

```
.
├── backend/
│   ├── api/              # Vercel serverless functions
│   │   ├── _db.js       # MongoDB connection
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── createJob.js
│   │   ├── getJob.js
│   │   ├── dashboard.js
│   │   └── submit.js
│   ├── server.js        # Local dev server
│   ├── vercel.json      # Vercel deployment config
│   └── package.json
├── fronted/             # Frontend (static HTML/CSS/JS)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── create-job.html
│   ├── job.html
│   ├── css/
│   └── js/
└── .env.local          # Local environment variables
```

## Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for deployment)
- Git and GitHub account

## Local Development Setup

### 1. Install Dependencies

```bash
cd backend
npm install

# Or if you want to also install dev dependencies for nodemon
npm install --save-dev nodemon
```

### 2. Configure MongoDB

Create a `.env.local` file in the root directory (already created):

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

Replace with your actual MongoDB Atlas connection string.

**To get MongoDB Atlas URL:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Go to "Connect" > "Connect Your Application"
4. Copy the connection string and replace `username`, `password`, and cluster name

### 3. Run Backend Locally

```bash
cd backend
npm run dev
```

This will start a local server at `http://localhost:5000`

- Backend API: `http://localhost:5000/api`
- Frontend: `http://localhost:5000` (served from backend/server.js)

### 4. Access the Application

- **Register**: http://localhost:5000/register.html
- **Login**: http://localhost:5000/login.html
- **Dashboard**: http://localhost:5000/dashboard.html
- **Create Job**: http://localhost:5000/create-job.html

The frontend automatically detects the environment and uses:
- Local: `http://localhost:5000/api`
- Production: Your Vercel backend URL

## Deployment to Vercel

### Option 1: Separate Deployments (Recommended for Beginners)

#### Deploy Backend

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New..." → "Project"
4. Import your repository
5. **Root Directory**: `backend`
6. **Environment Variables**: Add `MONGO_URL` with your MongoDB connection string
7. Deploy

Note your backend URL (e.g., `https://dmless-api.vercel.app`)

#### Deploy Frontend

1. In [vercel.com](https://vercel.com), create another project from the same repo
2. **Root Directory**: `fronted` (or rename to `frontend`)
3. Configure build:
   - **Build Command**: `echo "Static site - no build needed"`
   - **Output Directory**: (leave empty)

Update `fronted/js/script.js` to use your backend URL:

```javascript
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API = isLocalhost 
  ? 'http://localhost:5000/api' 
  : 'https://YOUR_VERCEL_BACKEND_URL.vercel.app/api';
```

### Option 2: Full-Stack Deployment (Monorepo)

1. Update root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "fronted/$1"
    }
  ]
}
```

2. Create a root `package.json`:

```json
{
  "private": true,
  "scripts": {
    "build": "cd backend && npm install"
  }
}
```

3. Deploy as single project to Vercel

## API Endpoints

### Authentication
- `POST /api/register` - Register new recruiter
- `POST /api/login` - Login recruiter

### Jobs
- `POST /api/createJob` - Create new job posting
- `GET /api/job/:id` - Get job details
- `GET /api/dashboard` - Get job statistics
- `POST /api/submit` - Submit job application

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `PORT` | Server port (local only) | `5000` (default) |

## Troubleshooting

### Local Server Won't Start
- Ensure MongoDB URL is correct in `.env.local`
- Check if port 5000 is already in use
- Run `npm install` to install dependencies

### Connection to Backend Fails
- Verify MongoDB Atlas IP whitelist includes your machine
- Check MONGO_URL connection string format
- Ensure backend is running on localhost:5000

### Frontend Can't Connect to Deployed Backend
- Verify backend URL in `fronted/js/script.js`
- Check CORS is enabled in backend
- Ensure backend environment variables are set in Vercel

## Important Notes

1. **Rename "fronted" to "frontend"** - The folder name contains a typo
   ```bash
   mv fronted frontend
   ```
   Then update references in config files.

2. **Security**: The `.env.local` file contains secrets - never commit it to GitHub
   - Add `.env.local` to `.gitignore`

3. **MongoDB**: Free tier has limits. Monitor usage in Atlas dashboard.

4. **CORS**: API is configured to accept requests from any origin for development.

## Development Tips

- Use `npm run dev` with nodemon to auto-restart on file changes
- Browser DevTools console shows API URL being used
- Check `/api/health` endpoint to verify backend is running
- MongoDB collections created: `recruiters`, `jobs`, `submissions`

## Next Steps

1. Set up MongoDB Atlas and get connection string
2. Run `npm install` in backend folder
3. Start local server with `npm run dev`
4. Test all features locally
5. Deploy to Vercel and update frontend API URL

---

**Quick Start Command:**
```bash
cd backend && npm install && npm run dev
```

Then open: http://localhost:5000
