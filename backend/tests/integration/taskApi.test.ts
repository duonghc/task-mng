import request from 'supertest';
import app from '../../src/app';

describe('Task API', () => {
  let token: string;
  beforeAll(async () => {
    // Register and login a user
    await request(app).post('/api/v1/users/register').send({ name: 'Test', email: 'test@int.com', password: 'Password123!' });
    const res = await request(app).post('/api/v1/users/login').send({ email: 'test@int.com', password: 'Password123!' });
    token = res.body.token;
  });

  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration Task', priority_id: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get tasks', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
