import { taskRepository } from '../repositories/taskRepository';
import { Task } from '../models/Task';

export class TaskService {
  async createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    if (!data.title || !data.priority_id) {
      throw new Error('Title and priority are required');
    }
    if (data.due_date && isNaN(new Date(data.due_date as any).getTime())) {
      throw new Error('Invalid due date');
    }
    return await taskRepository.create(data);
  }

  async getTaskById(id: number) {
    const task = await taskRepository.findById(id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async getTasksForUser(user_id: number, filters: any = {}) {
    return await taskRepository.findAllByUser(user_id, filters);
  }

  async updateTask(id: number, data: Partial<Task>) {
    if (data.due_date && isNaN(new Date(data.due_date as any).getTime())) {
      throw new Error('Invalid due date');
    }
    const updated = await taskRepository.update(id, data);
    if (!updated) throw new Error('Task not found');
    return updated;
  }

  async deleteTask(id: number) {
    await taskRepository.delete(id);
  }
}
