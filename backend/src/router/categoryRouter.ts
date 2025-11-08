import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategory,
  bulkReorderCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get all categories
router.get("/", getAllCategories);

// Get category by ID
router.get("/:id", getCategoryById);

// Create new category
router.post("/", createCategory);

// Update category
router.put("/:id", updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

// Reorder category (single)
router.patch("/:id/reorder", reorderCategory);

// Bulk reorder categories
router.post("/reorder", bulkReorderCategories);

export default router;