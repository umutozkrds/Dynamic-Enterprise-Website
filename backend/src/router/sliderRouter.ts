import express from "express";
import { createSlider, deleteSlider, getAllSliders, updateSlider } from "../controllers/sliderController.js";

const router = express.Router();

// Public routes
router.get("/", getAllSliders);
router.post("/", createSlider);
router.delete("/:id", deleteSlider);
router.put("/:id", updateSlider);

export default router;

