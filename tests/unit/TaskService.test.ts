import { TaskService } from '../../src/services/TaskService';
import { taskRepository } from '../../src/repositories/taskRepository';

jest.mock('../../src/repositories/taskRepository');

const mockTaskRepo = taskRepository as jest.Mocked<typeof taskRepository>;

describe('TaskService', () => {
  const service = new TaskService();

  beforeEach(() => jest.clearAllMocks());

  it('should create a task with valid data', async () => {
    mockTaskRepo.create.mockResolvedValue({ id: 1, user_id: 1, title: 'Test', priority_id: 1, is_complete: false, created_at: new Date(), updated_at: new Date() });
    const task = await service.createTask({ user_id: 1, title: 'Test', priority_id: 1, is_complete: false });
    expect(task).toHaveProperty('id');
    expect(mockTaskRepo.create).toHaveBeenCalled();
  });

  it('should throw if title is missing', async () => {
    await expect(service.createTask({ user_id: 1, title: '', priority_id: 1, is_complete: false })).rejects.toThrow('Title and priority are required');
  });

  it('should throw if due_date is invalid', async () => {
    await expect(service.createTask({ user_id: 1, title: 'Test', priority_id: 1, is_complete: false, due_date: 'invalid-date' as any })).rejects.toThrow('Invalid due date');
  });
});
