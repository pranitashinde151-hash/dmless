import { connectDB } from "./_db.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const db = await connectDB();
  const { email, password } = req.body;

  const user = await db.collection("recruiters").findOne({ email });
  if (!user) return res.json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ error: "Invalid credentials" });

  res.json({ id: user._id });
}
