import type { Request, Response } from "express";
import { getAllSubCategoriesService } from "../services/subCategoryService.js";

export const getAllSubCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const subCategories = await getAllSubCategoriesService();
        res.status(200).json({ subCategories });
    } catch (error: any) {
        console.error("Error fetching sub categories:", error.message);
        res.status(500).json({ message: "Failed to fetch sub categories" });
    }
};