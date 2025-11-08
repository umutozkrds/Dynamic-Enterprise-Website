import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSlider, deleteSlider, fetchSliders, updateSlider, reorderSliders } from "../../restapi/slider";
import type { Slider } from "../../interfaces/slider";

interface SliderState {
  sliders: Slider[];
  loading: boolean;
  error: string | null;
  currentSlideIndex: number;
}

const initialState: SliderState = {
  sliders: [],
  loading: false,
  error: null,
  currentSlideIndex: 0,
};

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    setCurrentSlideIndex: (state, action: PayloadAction<number>) => {
      state.currentSlideIndex = action.payload;
    },
    nextSlide: (state) => {
      if (state.sliders.length > 0) {
        state.currentSlideIndex =
          (state.currentSlideIndex + 1) % state.sliders.length;
      }
    },
    previousSlide: (state) => {
      if (state.sliders.length > 0) {
        state.currentSlideIndex =
          state.currentSlideIndex === 0
            ? state.sliders.length - 1
            : state.currentSlideIndex - 1;
      }
    },
    updateSliderOrder: (state, action: PayloadAction<Slider[]>) => {
      state.sliders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSliders.fulfilled,
        (state, action: PayloadAction<Slider[]>) => {
          state.loading = false;
          state.sliders = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlider.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to manually add - we'll refetch the list to get fresh data
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSlider.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSlider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSlider.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(reorderSliders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderSliders.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(reorderSliders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentSlideIndex, nextSlide, previousSlide, updateSliderOrder } =
  sliderSlice.actions;
export default sliderSlice.reducer;
