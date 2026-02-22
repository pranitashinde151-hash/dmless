import { connectDB } from "./_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectDB();
  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: "Job ID required" });
  }

  try {
    // Get candidates with their details
    const candidates = await db.collection("candidates")
      .find({ jobId: new ObjectId(jobId) })
      .sort({ submittedAt: -1 })
      .toArray();

    // Get job details to get the MCQs that were answered
    const job = await db.collection("jobs").findOne({ _id: new ObjectId(jobId) });

    res.json({ 
      candidates,
      job: {
        jobRole: job?.jobRole,
        jobDescription: job?.jobDescription,
        questions: job?.questions
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
}
