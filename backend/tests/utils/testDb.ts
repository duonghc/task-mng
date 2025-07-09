import { Pool } from 'pg';

export const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
});

export async function resetDb() {
  await testPool.query('TRUNCATE TABLE tasks, users RESTART IDENTITY CASCADE');
}
