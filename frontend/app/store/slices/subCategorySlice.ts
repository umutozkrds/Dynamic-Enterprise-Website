import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSubCategories } from "../../restapi/subCategory";
import type { SubCategory } from "../../interfaces/subCategory";

interface SubCategoryState {
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  loading: false,
  error: null,
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSubCategories.fulfilled,
        (state, action: PayloadAction<SubCategory[]>) => {
          state.loading = false;
          state.subCategories = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subCategorySlice.reducer;

