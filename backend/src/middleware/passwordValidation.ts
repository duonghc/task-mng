import { Request, Response, NextFunction } from 'express';

export function validatePasswordStrength(req: Request, res: Response, next: NextFunction): void {
  const password = req.body.password;
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!strongRegex.test(password)) {
    res.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
    return;
  }
  next();
}
