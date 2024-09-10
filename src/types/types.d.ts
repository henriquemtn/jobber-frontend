// Padronizando os Types
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  created_at: string; // ISO 8601 date string
  description: string;
  image: string | null;
  due_date: string; // ISO 8601 date string
  priority: string;
  status: string;
  owner: number;
}
