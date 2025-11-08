export interface User {
  id: number;
  name?: string;
  surname?: string;
  username?: string;
  email: string;
  password: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

