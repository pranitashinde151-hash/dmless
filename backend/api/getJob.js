import { connectDB } from "./_db.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await connectDB();
  const { id } = req.query;

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(id),
  });

  res.json(job);
}
