import type { Request, Response } from "express";
import {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  reorderCategoryService,
  bulkReorderCategoriesService,
} from "../services/categoriesService.js";

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({ categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }
    
    const category = await getCategoryByIdService(id);
    
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    
    res.status(200).json({ category });
  } catch (error: any) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, parent_id } = req.body;
    
    // Validation
    if (!name || !slug) {
      res.status(400).json({ message: "Name and slug are required" });
      return;
    }
    
    // Validate parent_id if provided
    const parentId = parent_id === null || parent_id === undefined ? null : parseInt(parent_id);
    
    if (parentId !== null && isNaN(parentId)) {
      res.status(400).json({ message: "Invalid parent_id" });
      return;
    }
    
    const result = await createCategoryService(name, slug, parentId);
    res.status(201).json({ 
      message: "Category created successfully", 
      insertId: result.insertId 
    });
  } catch (error: any) {
    console.error("Error creating category:", error.message);
    
    if (error.message.includes("already exists")) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to create category" });
    }
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { name, slug, parent_id } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }
    
    // Validation
    if (!name || !slug) {
      res.status(400).json({ message: "Name and slug are required" });
      return;
    }
    
    // Validate parent_id if provided
    const parentId = parent_id === null || parent_id === undefined ? null : parseInt(parent_id);
    
    if (parentId !== null && isNaN(parentId)) {
      res.status(400).json({ message: "Invalid parent_id" });
      return;
    }
    
    // Prevent self-referencing
    if (parentId === id) {
      res.status(400).json({ message: "Category cannot be its own parent" });
      return;
    }
    
    const result = await updateCategoryService(id, name, slug, parentId);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    
    res.status(200).json({ 
      message: "Category updated successfully",
      affectedRows: result.affectedRows
    });
  } catch (error: any) {
    console.error("Error updating category:", error.message);
    
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("already exists")) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to update category" });
    }
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }
    
    const result = await deleteCategoryService(id);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    
    res.status(200).json({ 
      message: "Category deleted successfully",
      affectedRows: result.affectedRows
    });
  } catch (error: any) {
    console.error("Error deleting category:", error.message);
    
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("with subcategories")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to delete category" });
    }
  }
};

export const reorderCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { order } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }
    
    if (order === undefined || isNaN(parseInt(order))) {
      res.status(400).json({ message: "Valid order number is required" });
      return;
    }
    
    const newOrder = parseInt(order);
    
    await reorderCategoryService(id, newOrder);
    res.status(200).json({ message: "Category reordered successfully" });
  } catch (error: any) {
    console.error("Error reordering category:", error.message);
    
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes("must be non-negative")) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to reorder category" });
    }
  }
};

export const bulkReorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items } = req.body as { items: { id: number; order: number }[] };
    
    if (!items || !Array.isArray(items)) {
      res.status(400).json({ message: "Invalid request: items array is required" });
      return;
    }
    
    const result = await bulkReorderCategoriesService(items);
    res.status(200).json({ 
      message: "Categories reordered successfully", 
      success: result.success,
      updated: result.updated
    });
  } catch (error: any) {
    console.error("Error bulk reordering categories:", error.message);
    
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to reorder categories", error: error.message });
    }
  }
};