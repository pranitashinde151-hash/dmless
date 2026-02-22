import { connectDB } from "./_db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const db = await connectDB();
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = await db.collection("recruiters").findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.collection("recruiters").insertOne({
    name,
    email,
    password: hashed,
    createdAt: new Date(),
  });

  // Generate JWT token
  const token = jwt.sign(
    { id: result.insertedId.toString(), email, name },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );

  res.status(201).json({ 
    message: "Registered Successfully",
    token,
    user: {
      id: result.insertedId.toString(),
      name,
      email
    }
  });
}
