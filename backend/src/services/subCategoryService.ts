import { pool } from "../config/db.js";
import type { SubCategory } from "../types/subCategory.js";

export const getAllSubCategoriesService = async (): Promise<SubCategory[]> => {
    const query = "SELECT * FROM subcategories ORDER BY `order` ASC";
    const [rows] = await pool.query(query);
    return rows as SubCategory[];
};