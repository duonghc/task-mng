import { userRepository } from '../repositories/userRepository';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export class UserService {
  async register(data: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }) {
    if (!data.name || !data.email || !data.password) {
      throw new Error('All fields are required');
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      throw new Error('Invalid email');
    }
    if (data.password.length < 8) {
      throw new Error('Password too short');
    }
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    return await userRepository.create(data);
  }

  async authenticate(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }

  async getProfile(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(id: number, data: Partial<User>) {
    return await userRepository.update(id, data);
  }

  async resetPassword(id: number, newPassword: string) {
    if (newPassword.length < 8) throw new Error('Password too short');
    return await userRepository.update(id, { password: newPassword });
  }
}
