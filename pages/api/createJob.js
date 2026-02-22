import { connectDB } from './_db.js';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const db = await connectDB();
  const { recruiterId, jobRole, jobDescription, questions } = req.body;

  // Validate inputs
  if (!recruiterId || !jobRole || !jobDescription || !questions || questions.length !== 5) {
    return res.status(400).json({ error: 'All fields required. Exactly 5 questions needed.' });
  }

  // Validate questions
  for (const q of questions) {
    if (!q.question || !q.options || q.options.length < 2 || !q.correct) {
      return res.status(400).json({ error: 'Invalid question format' });
    }
  }

  try {
    const result = await db.collection('jobs').insertOne({
      recruiterId: new ObjectId(recruiterId),
      jobRole,
      jobDescription,
      questions,
      createdAt: new Date(),
      candidates: 0,
      knocked: 0,
      shortlisted: 0,
    });

    res.status(201).json({
      id: result.insertedId.toString(),
      message: 'Job created successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
}

export default handler;
