import { connectDB } from "./_db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const db = await connectDB();
  const { name, email, password } = req.body;

  const existing = await db.collection("recruiters").findOne({ email });
  if (existing) {
    return res.json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await db.collection("recruiters").insertOne({
    name,
    email,
    password: hashed,
  });

  res.json({ message: "Registered Successfully" });
}
