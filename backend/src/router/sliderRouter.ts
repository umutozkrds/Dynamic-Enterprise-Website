import express from "express";
import { createSlider, deleteSlider, getAllSliders, updateSlider, reorderSliders } from "../controllers/sliderController.js";

const router = express.Router();

// Public routes
router.get("/", getAllSliders);
router.post("/", createSlider);
router.delete("/:id", deleteSlider);
router.put("/:id", updateSlider);
router.post("/reorder", reorderSliders);

export default router;

