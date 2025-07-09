import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/requireAuth';
import { TaskService } from '../services/TaskService';

const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    // Nếu không truyền assignee_id thì mặc định là user_id
    const assignee_id = req.body.assignee_id ?? user_id;
    const task = await taskService.createTask({ ...req.body, user_id, assignee_id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user_id = req.user?.id || req.query.user_id;
    const tasks = await taskService.getTasksForUser(Number(user_id), req.query);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await taskService.updateTask(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const assignTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignee_id } = req.body;
    if (!assignee_id) {
      res.status(400).json({ error: 'assignee_id is required' });
      return;
    }
    const updated = await taskService.updateTask(Number(id), { assignee_id });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
