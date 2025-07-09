import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validatePasswordStrength } from '../middleware/passwordValidation';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Dummy user store (replace with DB in production)
const users: any[] = [];

router.post('/register', authRateLimiter, validatePasswordStrength, async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  if (users.find(u => u.email === email)) {
    res.status(400).json({ error: 'Email already registered' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password: hash };
  users.push(user);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const secret = process.env.JWT_SECRET || 'changeme';
  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
