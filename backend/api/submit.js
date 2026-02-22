import { connectDB } from "./_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectDB();
  const { jobId, name, email, answers, resume } = req.body;

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(jobId),
  });

  let status = "shortlisted";

  for (let i = 0; i < job.questions.length; i++) {
    if (answers[i] !== job.questions[i].correct) {
      status = "knocked";
      break;
    }
  }

  await db.collection("candidates").insertOne({
    jobId,
    name,
    email,
    status,
    resume: status === "shortlisted" ? resume : null,
  });

  res.json({ status });
}
