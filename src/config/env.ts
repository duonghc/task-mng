import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
export const PORT = process.env.PORT || 3000;
export const DB_URL = process.env.DATABASE_URL || '';
// in ra các giá trị môi trường để kiểm tra
console.log('JWT_SECRET:', JWT_SECRET);
console.log('PORT:', PORT);
console.log('DB_URL:', DB_URL); // Uncomment if you want to log the DB_URL
