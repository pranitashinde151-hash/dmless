import { connectDB } from "./_db.js";

export default async function handler(req, res) {
  const db = await connectDB();
  const { jobId } = req.body;

  const total = await db.collection("candidates").countDocuments({ jobId });

  const knocked = await db
    .collection("candidates")
    .countDocuments({ jobId, status: "knocked" });

  const shortlisted = await db
    .collection("candidates")
    .countDocuments({ jobId, status: "shortlisted" });

  res.json({ total, knocked, shortlisted });
}
