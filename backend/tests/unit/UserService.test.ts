import { UserService } from '../../src/services/UserService';
import { userRepository } from '../../src/repositories/userRepository';

jest.mock('../../src/repositories/userRepository');

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;

describe('UserService', () => {
  const service = new UserService();

  beforeEach(() => jest.clearAllMocks());

  it('should register a user with valid data', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com', password: 'hashed', created_at: new Date(), updated_at: new Date() });
    const user = await service.register({ name: 'Test', email: 'test@example.com', password: 'Password123!' });
    expect(user).toHaveProperty('id');
    expect(mockUserRepo.create).toHaveBeenCalled();
  });

  it('should throw if email is invalid', async () => {
    await expect(service.register({ name: 'Test', email: 'bad', password: 'Password123!' })).rejects.toThrow('Invalid email');
  });

  it('should throw if password is too short', async () => {
    await expect(service.register({ name: 'Test', email: 'test@example.com', password: 'short' })).rejects.toThrow('Password too short');
  });
});
