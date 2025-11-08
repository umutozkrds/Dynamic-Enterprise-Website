import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { SubCategory } from "../interfaces/subCategory";

const API_URL = "http://localhost:3002/api/sub-categories";

export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.subCategories;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch subcategories"
        );
      }
      return rejectWithValue("Failed to fetch subcategories");
    }
  }
);

