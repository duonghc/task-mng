import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import type { AuthRequest } from '../middleware/requireAuth';

const userService = new UserService();

export const register = (req: Request, res: Response, next: NextFunction): void => {
  userService.register(req.body)
    .then(user => { res.status(201).json(user); })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  userService.authenticate(email, password)
    .then(result => { res.json(result); })
    .catch(next);
};

export const getProfile = (req: AuthRequest, res: Response, next: NextFunction): void => {
  userService.getProfile(req.user.id)
    .then(user => { res.json(user); return undefined; })
    .catch(next);
};

export const updateProfile = (req: AuthRequest, res: Response, next: NextFunction): void => {
  userService.updateProfile(req.user.id, req.body)
    .then(updated => { res.json(updated); return undefined; })
    .catch(next);
};

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
