import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCategories, bulkReorderCategories } from "../../restapi/category";
import type { Category } from "../../interfaces/category";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateCategoryOrder: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(bulkReorderCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkReorderCategories.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(bulkReorderCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCategoryOrder } = categorySlice.actions;
export default categorySlice.reducer;

