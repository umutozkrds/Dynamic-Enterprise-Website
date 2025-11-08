import express from "express";
import { getAllSubCategories } from "../controllers/subCategoryController.js";

const router = express.Router();

router.get("/", getAllSubCategories);

export default router;
