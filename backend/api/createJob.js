import { connectDB } from "./_db.js";

export default async function handler(req, res) {
  const db = await connectDB();
  const job = req.body;

  const result = await db.collection("jobs").insertOne(job);

  res.json({ id: result.insertedId });
}
