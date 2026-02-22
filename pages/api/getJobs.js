import { connectDB } from './_db.js';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const db = await connectDB();
  const { recruiterId } = req.query;

  if (!recruiterId) {
    return res.status(400).json({ error: 'Recruiter ID required' });
  }

  try {
    const jobs = await db.collection('jobs')
      .find({ recruiterId: new ObjectId(recruiterId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
}

export default handler;
