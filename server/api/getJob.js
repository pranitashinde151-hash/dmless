import { connectDB } from "./_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectDB();
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Job ID required" });
  }

  try {
    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(id),
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
}
