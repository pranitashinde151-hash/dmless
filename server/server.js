import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env.local' });

// Import API handlers
import registerHandler from './api/register.js';
import loginHandler from './api/login.js';
import createJobHandler from './api/createJob.js';
import getJobHandler from './api/getJob.js';
import getJobsHandler from './api/getJobs.js';
import dashboardHandler from './api/dashboard.js';
import submitHandler from './api/submit.js';
import getCandidatesHandler from './api/getCandidates.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// API Routes
app.post('/api/register', (req, res) => registerHandler(req, res));
app.post('/api/login', (req, res) => loginHandler(req, res));
app.post('/api/createJob', (req, res) => createJobHandler(req, res));
app.get('/api/job/:id', (req, res) => {
  req.query.id = req.params.id;
  getJobHandler(req, res);
});
app.get('/api/jobs', (req, res) => getJobsHandler(req, res));
app.get('/api/candidates', (req, res) => getCandidatesHandler(req, res));
app.get('/api/dashboard', (req, res) => dashboardHandler(req, res));
app.post('/api/dashboard', (req, res) => dashboardHandler(req, res));
app.post('/api/submit', (req, res) => submitHandler(req, res));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'dmless Backend API Server', status: 'running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔌 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
