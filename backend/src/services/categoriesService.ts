import { pool } from "../config/db.js";
import type { Category } from "../types/category.js";
import type { RowDataPacket } from "mysql2";

export const getAllCategoriesService = async (): Promise<Category[]> => {
  const query = "SELECT * FROM categories ORDER BY parent_id ASC, `order` ASC";
  const [rows] = await pool.query(query);
  return rows as Category[];
};

export const getCategoryByIdService = async (
  id: number
): Promise<Category | null> => {
  const query = "SELECT * FROM categories WHERE id = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Category;
};

export const createCategoryService = async (
  name: string,
  slug: string,
  parent_id: number | null
): Promise<{ insertId: number }> => {
  // 1️⃣ Slug kontrolü
  const checkQuery = "SELECT id FROM categories WHERE slug = ?";
  const [existing] = await pool.query<RowDataPacket[]>(checkQuery, [slug]);
  if (existing.length > 0) {
    throw new Error("Category with this slug already exists");
  }

  // 2️⃣ Aynı parent_id altında max order’ı bul
  const orderQuery = `
    SELECT COALESCE(MAX(\`order\`), 0) AS maxOrder
    FROM categories
    WHERE ${parent_id === null ? "parent_id IS NULL" : "parent_id = ?"}
  `;

  const [orderResult] = await pool.query<RowDataPacket[]>(
    orderQuery,
    parent_id === null ? [] : [parent_id]
  );

  const nextOrder = orderResult[0]?.maxOrder + 1;

  // 3️⃣ Yeni kategori ekle
  const insertQuery = `
    INSERT INTO categories (name, slug, parent_id, \`order\`)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = (await pool.query(insertQuery, [
    name,
    slug,
    parent_id,
    nextOrder,
  ])) as any;

  return { insertId: result.insertId };
};

export const updateCategoryService = async (
  id: number,
  name: string,
  slug: string,
  parent_id: number | null
): Promise<{ affectedRows: number }> => {
  // Check if category exists
  const category = await getCategoryByIdService(id);
  if (!category) {
    throw new Error("Category not found");
  }

  // Check if slug is being changed and if new slug already exists
  if (slug !== category.slug) {
    const checkQuery = "SELECT id FROM categories WHERE slug = ? AND id != ?";
    const [existing] = await pool.query<RowDataPacket[]>(checkQuery, [
      slug,
      id,
    ]);

    if (existing.length > 0) {
      throw new Error("Category with this slug already exists");
    }
  }

  // If parent_id is changing, need to reorder
  if (parent_id !== category.parent_id) {
    // Get max order for new parent
    const maxOrderQuery = `
      SELECT COALESCE(MAX(\`order\`), -1) as max_order
      FROM categories
      WHERE (parent_id = ? OR (parent_id IS NULL AND ? IS NULL))
    `;
    const [orderRows] = await pool.query<RowDataPacket[]>(maxOrderQuery, [
      parent_id,
      parent_id,
    ]);
    const newOrder = (orderRows[0]?.max_order as number) + 1;

    // Update the category with new parent and order
    const query =
      "UPDATE categories SET name = ?, slug = ?, parent_id = ?, `order` = ? WHERE id = ?";
    const [result] = await pool.query(query, [
      name,
      slug,
      parent_id,
      newOrder,
      id,
    ]);

    // Reorder old siblings
    await pool.query(
      "UPDATE categories SET `order` = `order` - 1 WHERE (parent_id = ? OR (parent_id IS NULL AND ? IS NULL)) AND `order` > ?",
      [category.parent_id, category.parent_id, category.order]
    );

    return { affectedRows: (result as any).affectedRows };
  } else {
    // Just update name and slug
    const query = "UPDATE categories SET name = ?, slug = ? WHERE id = ?";
    const [result] = await pool.query(query, [name, slug, id]);
    return { affectedRows: (result as any).affectedRows };
  }
};

export const deleteCategoryService = async (
  id: number
): Promise<{ affectedRows: number }> => {
  // Check if category exists
  const category = await getCategoryByIdService(id);
  if (!category) {
    throw new Error("Category not found");
  }

  // Check if category has children
  const childQuery =
    "SELECT COUNT(*) as count FROM categories WHERE parent_id = ?";
  const [childRows] = await pool.query<RowDataPacket[]>(childQuery, [id]);

  if (childRows[0]?.count && childRows[0].count > 0) {
    throw new Error("Cannot delete category with subcategories");
  }

  // Delete category (trigger will handle reordering)
  const query = "DELETE FROM categories WHERE id = ?";
  const [result] = await pool.query(query, [id]);

  return { affectedRows: (result as any).affectedRows };
};

export const reorderCategoryService = async (
  id: number,
  newOrder: number
): Promise<{ success: boolean }> => {
  // Check if category exists
  const category = await getCategoryByIdService(id);
  if (!category) {
    throw new Error("Category not found");
  }

  // Validate new order
  if (newOrder < 0) {
    throw new Error("Order must be non-negative");
  }

  // Use stored procedure to reorder
  await pool.query("CALL reorder_categories(?, ?)", [id, newOrder]);

  return { success: true };
};

// Bulk reorder categories
export const bulkReorderCategoriesService = async (
  items: { id: number; order: number }[]
): Promise<{ success: boolean; updated: number }> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update each category's order
    for (const item of items) {
      // Validate that category exists
      const [rows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM categories WHERE id = ?",
        [item.id]
      );

      if (rows.length === 0) {
        throw new Error(`Category with id ${item.id} not found`);
      }

      await connection.query("UPDATE categories SET `order` = ? WHERE id = ?", [
        item.order,
        item.id,
      ]);
    }

    await connection.commit();
    return { success: true, updated: items.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
