# dmless - Next.js Full Stack Recruitment Platform

A modern, full-stack recruitment platform built with **Next.js**, **React**, **MongoDB**, and **JWT authentication**. Create smart hiring links with MCQ-based candidate screening and real-time analytics.

## 🎯 Features

✅ **Smart Hiring Links** - Generate shareable candidate screening links  
✅ **MCQ-Based Screening** - 5-question knockout-style assessment  
✅ **Real-time Dashboard** - Track candidates, knockouts, and shortlists  
✅ **Resume Management** - Auto-store resumes from shortlisted candidates  
✅ **JWT Authentication** - Secure recruiter account management  
✅ **MongoDB Integration** - Scalable NoSQL data storage  
✅ **Serverless Ready** - Deploy to Vercel with one click  

## 📋 Project Structure

```
dmless/
├── pages/
│   ├── _app.js                 # Global app wrapper & Auth provider
│   ├── index.js                # Landing page
│   ├── features.js             # Features page
│   ├── login.js                # Login page
│   ├── register.js             # Register page
│   ├── dashboard.js            # Recruiter dashboard
│   ├── create-job.js           # Create job posting
│   ├── job/[id].js             # Candidate job submission
│   ├── candidates/[jobId].js   # View job candidates
│   └── api/
│       ├── _db.js              # MongoDB connection
│       ├── register.js         # Register endpoint
│       ├── login.js            # Login endpoint
│       ├── createJob.js        # Create job endpoint
│       ├── getJob.js           # Get single job
│       ├── getJobs.js          # Get recruiter's jobs
│       ├── getCandidates.js    # Get job candidates
│       ├── submit.js           # Submit application
│       ├── dashboard.js        # Job stats
│       └── health.js           # Health check
├── components/
│   ├── Navbar.js               # Navigation component
│   └── Alert.js                # Alert/notification component
├── context/
│   └── AuthContext.js          # Authentication state management
├── lib/
│   └── api.js                  # API helper functions
├── public/                      # Static assets (optional)
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
└── .env.local.example          # Environment variables template
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### 2. Setup Environment

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your MongoDB URL and JWT secret
nano .env.local
```

**Example `.env.local`:**
```env
MONGO_URL=mongodb://localhost:27017
JWT_SECRET=your-secure-random-string-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🔑 Key Endpoints

### Authentication
- `POST /api/register` - Create new recruiter account
- `POST /api/login` - Login with email & password

### Job Management
- `POST /api/createJob` - Create new job (recruiters)
- `GET /api/job/:id` - Get job details (candidates)
- `GET /api/getJobs?recruiterId=xxx` - Get recruiter's jobs
- `GET /api/dashboard` - Get job statistics

### Applications
- `POST /api/submit` - Submit candidate application
- `GET /api/candidates?jobId=xxx` - Get job candidates (recruiters)

### Health Check
- `GET /api/health` - Server status

## 📝 How It Works

### For Recruiters
1. **Register** - Create an account with name, email, password
2. **Create Job** - Add job role, description, and 5 screening MCQs
3. **Share Link** - Get a unique candidate link to share on social media
4. **Track Candidates** - View real-time stats: total applications, shortlisted, knocked out

### For Candidates
1. **Access Link** - Click the recruiter's shared job link
2. **Answer MCQs** - Complete 5 screening questions
3. **Upload Resume** - If shortlisted, optionally upload resume
4. **Get Result** - Instant feedback on application status

### Screening Logic
- All 5 questions must be answered correctly to be **Shortlisted**
- Any wrong answer = **Knocked Out**
- Only shortlisted candidates can upload resumes
- Resumes are stored only for shortlisted applicants

## 🏗️ Database Schema

### Recruiters Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  recruiterId: ObjectId,
  jobRole: String,
  jobDescription: String,
  questions: [
    {
      question: String,
      options: [String],
      correct: String
    }
  ],
  candidates: Number,
  shortlisted: Number,
  knocked: Number,
  createdAt: Date
}
```

### Candidates Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId,
  name: String,
  email: String,
  status: "shortlisted" | "knocked",
  resume: String (base64 or null),
  submittedAt: Date
}
```

## 🔒 Security

- **JWT Authentication** - Secure token-based authentication with 7-day expiry
- **Password Hashing** - bcryptjs with 10 salt rounds
- **CORS Protection** - Configured for production deployments
- **MongoDB ObjectId Validation** - Prevents injection attacks
- **Environment Variables** - Sensitive data kept in .env.local

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Add environment variables in Vercel dashboard:**
- `MONGO_URL` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong random secret

### Deploy to AWS Lambda / Other Serverless

1. Build: `npm run build`
2. Deploy the `.next` directory to your serverless platform
3. Set environment variables via platform's configuration

### Deploy to Traditional Server

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone <your-repo>
cd dmless

# Install & build
npm install
npm run build

# Start with PM2
npm i -g pm2
pm2 start "npm start" --name dmless
```

## 📊 API Examples

### Create a Job
```bash
curl -X POST http://localhost:3000/api/createJob \
  -H "Content-Type: application/json" \
  -d '{
    "recruiterId": "507f1f77bcf86cd799439011",
    "jobRole": "Frontend Developer",
    "jobDescription": "Looking for experienced React developer...",
    "questions": [
      {
        "question": "What is React?",
        "options": ["Library", "Framework", "Language", "Tool"],
        "correct": "Library"
      },
      ...
    ]
  }'
```

### Submit Application
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "answers": ["Library", "..."],
    "resume": "data:application/pdf;base64,..."
  }'
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

### Hot Module Replacement
The dev server supports automatic reloading on file changes.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project as a template or reference.

## 🆘 Troubleshooting

**Problem:** MongoDB connection error
- Solution: Ensure MongoDB is running and `MONGO_URL` is correct in `.env.local`

**Problem:** JWT_SECRET not loaded
- Solution: Restart dev server after adding `.env.local`

**Problem:** Port 3000 already in use
- Solution: Kill the process or use: `PORT=3001 npm run dev`

**Problem:** Build fails
- Solution: Clear cache and rebuild: `rm -rf .next && npm run build`

## 📞 Support

For issues, questions, or suggestions:
1. Check existing documentation
2. Review the code structure
3. Create an issue on GitHub

---

**Built with ❤️ using Next.js, React, and MongoDB**
