import { connectDB } from './_db.js';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
  const db = await connectDB();
  const { jobId, name, email, answers, resume } = req.body;

  // Validate inputs
  if (!jobId || !name || !email || !answers) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const job = await db.collection('jobs').findOne({
      _id: new ObjectId(jobId),
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    let status = 'shortlisted';

    // Check if candidate answered all questions correctly (knockout logic)
    for (let i = 0; i < job.questions.length; i++) {
      if (answers[i] !== job.questions[i].correct) {
        status = 'knocked';
        break;
      }
    }

    // Insert candidate record
    const candidateResult = await db.collection('candidates').insertOne({
      jobId: new ObjectId(jobId),
      name,
      email,
      status,
      resume: status === 'shortlisted' ? resume : null,
      submittedAt: new Date(),
    });

    // Update job statistics
    const updateObj = { $inc: { candidates: 1 } };
    if (status === 'knocked') {
      updateObj.$inc.knocked = 1;
    } else {
      updateObj.$inc.shortlisted = 1;
    }

    await db.collection('jobs').updateOne(
      { _id: new ObjectId(jobId) },
      updateObj
    );

    res.json({
      status,
      candidateId: candidateResult.insertedId.toString(),
      message: status === 'shortlisted'
        ? "Congratulations! You've been shortlisted. Your resume has been saved."
        : "Thank you for applying. Unfortunately, you didn't pass this round."
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

export default handler;
