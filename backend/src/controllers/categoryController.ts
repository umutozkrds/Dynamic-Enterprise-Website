import type { Request, Response } from "express";
import { getAllCategoriesService } from "../services/categoriesService.js";

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({ categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};