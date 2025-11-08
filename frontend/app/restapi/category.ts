import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Category } from "../interfaces/category";

const API_URL = "http://localhost:3002/api/categories";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.categories;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch categories"
        );
      }
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category: Omit<Category, "id" | "created_at" | "updated_at" | "order">, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, category);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to create category"
        );
      }
      return rejectWithValue("Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category: { id: number; name: string; slug: string; parent_id: number | null }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${category.id}`, {
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update category"
        );
      }
      return rejectWithValue("Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to delete category"
        );
      }
      return rejectWithValue("Failed to delete category");
    }
  }
);

export const reorderCategory = createAsyncThunk(
  "category/reorderCategory",
  async ({ id, order }: { id: number; order: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/reorder`, { order });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to reorder category"
        );
      }
      return rejectWithValue("Failed to reorder category");
    }
  }
);

export const bulkReorderCategories = createAsyncThunk(
  "category/bulkReorderCategories",
  async (items: { id: number; order: number }[], { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reorder`, { items });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to reorder categories"
        );
      }
      return rejectWithValue("Failed to reorder categories");
    }
  }
);

