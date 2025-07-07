import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/requireAuth';
import { TaskService } from '../services/TaskService';

const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?.id || req.body.user_id; // adapt for auth middleware
    const task = await taskService.createTask({ ...req.body, user_id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?.id || req.query.user_id;
    const tasks = await taskService.getTasksForUser(Number(user_id), req.query);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await taskService.updateTask(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
