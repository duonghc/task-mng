import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 400;
  res.status(status).json({ error: err.message || 'An error occurred' });
}
