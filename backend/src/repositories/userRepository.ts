import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const userRepository = {
  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'> & { password: string }): Promise<User> {
    const hash = await bcrypt.hash(user.password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [user.name, user.email, hash]
    );
    return result.rows[0];
  },
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (!result.rows[0]) return null;
    const user = result.rows[0];
    return { ...user, password: user.password_hash };
  },
  async findById(id: number): Promise<User | null> {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (!result.rows[0]) return null;
    const user = result.rows[0];
    return { ...user, password: user.password_hash };
  },
  async update(id: number, data: Partial<User>): Promise<User | null> {
    // Only allow updating name, email, password
    const fields = [];
    const values = [];
    let idx = 1;
    if (data.name) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.email) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 10);
      fields.push(`password_hash = $${idx++}`); values.push(hash);
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },
  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  },
  async listUsers(): Promise<{ id: number; name: string; email: string }[]> {
    const result = await pool.query('SELECT id, name, email FROM users ORDER BY id ASC');
    return result.rows;
  }
};
