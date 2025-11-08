import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import authReducer from "./slices/authSlice";
import sliderReducer from "./slices/sliderSlice";
import categoryReducer from "./slices/categorySlice";
import subCategoryReducer from "./slices/subCategorySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    slider: sliderReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
