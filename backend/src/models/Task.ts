export interface Task {
  id: number;
  user_id: number;
  assignee_id?: number;
  title: string;
  description?: string;
  category_id?: number;
  priority_id: number;
  due_date?: Date;
  is_complete: boolean;
  created_at: Date;
  updated_at: Date;
}
