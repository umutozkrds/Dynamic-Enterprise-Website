import { pool } from "../config/db.js";
import type { Category } from "../types/category.js";

export const getAllCategoriesService = async (): Promise<Category[]> => {
  const query = "SELECT * FROM categories ORDER BY `order` ASC";
  const [rows] = await pool.query(query);
  return rows as Category[];
};
