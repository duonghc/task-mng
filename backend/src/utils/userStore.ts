// This is a placeholder for a real user data access layer
export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // hashed
}

const users: User[] = [];

export function addUser(user: User) {
  users.push(user);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function getUserById(id: number): User | undefined {
  return users.find(u => u.id === id);
}
