import type { Request, Response } from "express";
import { createSliderService, deleteSliderService, getAllSlidersService, updateSliderService } from "../services/sliderServices.js";
import type { Slider } from "../types/slider.js";

export const getAllSliders = async (req: Request, res: Response): Promise<void> => {
  try {
    const sliders = await getAllSlidersService();

    res.status(200).json({
      message: "Sliders fetched successfully",
      sliders,
    });
  } catch (error: any) {
    console.error("Error fetching sliders:", error.message);
    res.status(500).json({ message: "Failed to fetch sliders" });
  }
};

export const createSlider = async (req: Request, res: Response): Promise<void> => {
  try {
    const slider = await createSliderService(req.body as Slider);
    res.status(201).json({ message: "Slider created successfully", slider });
  } catch (error: any) {
    console.error("Error creating slider:", error.message);
    res.status(500).json({ message: "Failed to create slider" });
  }
};


export const deleteSlider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await deleteSliderService(parseInt(id as string));
    res.status(200).json({ message: "Slider deleted successfully", result });
  } catch (error: any) {
    console.error("Error deleting slider:", error.message);
    res.status(500).json({ message: "Failed to delete slider" });
  }
};


export const updateSlider = async (req: Request, res: Response): Promise<void> => {
  try {
    const slider = await updateSliderService(req.body as Slider);
    res.status(200).json({ message: "Slider updated successfully", slider });
  } catch (error: any) {
    console.error("Error updating slider:", error.message);
    res.status(500).json({ message: "Failed to update slider" });
  }
};