import { pool } from "../config/db.js";
import type { Slider } from "../types/slider.js";

export const getAllSlidersService = async () => {
  const query = "SELECT * FROM sliders ORDER BY `order` ASC";
  const [rows] = await pool.query(query);
  return rows;
};

export const createSliderService = async (slider: Slider) => {
  const query =
    "INSERT INTO sliders (title, subtitle, image_url) VALUES (?, ?, ?)";
  const [result] = (await pool.query(query, [
    slider.title,
    slider.subtitle,
    slider.image_url,
  ])) as any;

  // Return just the insertId - frontend will refetch all sliders
  return { insertId: result.insertId };
};

export const deleteSliderService = async (id: number) => {
  const query = "DELETE FROM sliders WHERE id = ?";
  const [result] = await pool.query(query, [id]);
  return { affectedRows: (result as any).affectedRows };
};

export const updateSliderService = async (slider: Slider) => {
  const query = "UPDATE sliders SET title = ?, subtitle = ?, image_url = ? WHERE id = ?";
  const [result] = await pool.query(query, [slider.title, slider.subtitle, slider.image_url, slider.id]);
  return { affectedRows: (result as any).affectedRows };
};

// Bulk reorder sliders
export const reorderSlidersService = async (items: { id: number; order: number }[]) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Update each slider's order
    for (const item of items) {
      await connection.query(
        "UPDATE sliders SET `order` = ? WHERE id = ?",
        [item.order, item.id]
      );
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
