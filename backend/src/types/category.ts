export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  order: number;
  created_at: Date;
  updated_at: Date;
}