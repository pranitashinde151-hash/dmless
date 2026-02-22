import { connectDB } from './_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function handler(req, res) {
  const db = await connectDB();
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await db.collection('recruiters').findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id.toString(), email: user.email, name: user.name },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
}

export default handler;
