import { pool } from '../config/db';
import { Task } from '../models/Task';

export const taskRepository = {
  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, assignee_id, title, description, category_id, priority_id, due_date, is_complete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [task.user_id, task.assignee_id ?? task.user_id, task.title, task.description, task.category_id, task.priority_id, task.due_date, task.is_complete]
    );
    return result.rows[0];
  },
  async findById(id: number): Promise<any | null> {
    const result = await pool.query(`
      SELECT t.*, u.name as assignee_name
      FROM tasks t
      LEFT JOIN users u ON t.assignee_id = u.id
      WHERE t.id = $1
    `, [id]);
    return result.rows[0] || null;
  },
  async findAllByUser(user_id: number, filters: any = {}): Promise<any[]> {
    let query = `SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON t.assignee_id = u.id WHERE t.assignee_id = $1`;
    const params: any[] = [user_id];
    let idx = 2;
    if (filters.priority_id) { query += ` AND t.priority_id = $${idx}`; params.push(filters.priority_id); idx++; }
    if (filters.is_complete !== undefined) { query += ` AND t.is_complete = $${idx}`; params.push(filters.is_complete); idx++; }
    if (filters.due_date) { query += ` AND t.due_date = $${idx}`; params.push(filters.due_date); idx++; }
    if (filters.search) { query += ` AND (t.title ILIKE $${idx} OR t.description ILIKE $${idx})`; params.push(`%${filters.search}%`); idx++; }
    query += ' ORDER BY t.due_date ASC, t.priority_id DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },
  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key of Object.keys(data)) {
      if (key === 'assignee_id' || key === 'user_id' || key === 'title' || key === 'description' || key === 'category_id' || key === 'priority_id' || key === 'due_date' || key === 'is_complete') {
        fields.push(`${key} = $${idx++}`);
        values.push((data as any)[key]);
      }
    }
    if (!fields.length) return this.findById(id);
    values.push(id);
    const result = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  },
  async delete(id: number): Promise<void> {
    await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  }
};
