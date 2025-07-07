export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed
  created_at: Date;
  updated_at: Date;
}
