import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Slider } from "../interfaces/slider";
const API_URL = "http://localhost:3002/api/sliders";

export const fetchSliders = createAsyncThunk(
  "slider/fetchSliders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.sliders;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch sliders"
        );
      }
      return rejectWithValue("Failed to fetch sliders");
    }
  }
);

export const createSlider = createAsyncThunk(
  "slider/createSlider",
  async (slider: Slider, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, slider);
      return response.data.slider;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create slider"
        );
      }
      return rejectWithValue("Failed to create slider");
    }
  }
);

export const deleteSlider = createAsyncThunk(
  "slider/deleteSlider",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data.result;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete slider"
        );
      }
      return rejectWithValue("Failed to delete slider");
    }
  }
);

export const updateSlider = createAsyncThunk(
  "slider/updateSlider",
  async (slider: Slider, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${slider.id}`, slider);
      return response.data.slider;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to update slider");
      }
      return rejectWithValue("Failed to update slider");
    }
  }
);

export const reorderSliders = createAsyncThunk(
  "slider/reorderSliders",
  async (items: { id: number; order: number }[], { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reorder`, { items });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || "Failed to reorder sliders");
      }
      return rejectWithValue("Failed to reorder sliders");
    }
  }
);