import { Pool } from 'pg';
import { DB_URL } from './env';

// Khởi tạo pool kết nối PostgreSQL dùng connectionString từ biến môi trường
export const pool = new Pool({
  connectionString: DB_URL,
  // Có thể thêm các option khác nếu cần
});

// Có thể export thêm hàm query tiện dụng nếu muốn
export const query = (text: string, params?: any[]) => pool.query(text, params);
