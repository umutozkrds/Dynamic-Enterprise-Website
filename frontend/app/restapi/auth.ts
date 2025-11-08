import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthState } from "../store/slices/authSlice";
const API_URL = "http://localhost:3002/api/users/login";

export const saveAuthData = (
  token: string,
  expirationDate: Date,
  userId: number,
  user?: any
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("expirationDate", expirationDate.toISOString());
  localStorage.setItem("userId", userId.toString());
  if (user) {
    localStorage.setItem("userData", JSON.stringify(user));
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("userData");
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(API_URL, credentials);

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);
      saveAuthData(
        response.data.token,
        expirationDate,
        response.data.user.id,
        response.data.user
      );
      return {
        token: response.data.token,
        userId: response.data.user.id,
        user: response.data.user,
      };
    } catch (error: any) {
      clearAuthData();
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      clearAuthData();
      return null;
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const getInitialAuthState = (): AuthState => {
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    // Server-side: return default unauthenticated state
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
      loading: false,
      error: null,
    };
  }

  // Client-side: try to restore from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const expirationDate = localStorage.getItem("expirationDate");
  const userDataString = localStorage.getItem("userData");

  if (token && expirationDate && new Date(expirationDate) > new Date()) {
    let user = null;
    if (userDataString) {
      try {
        user = JSON.parse(userDataString);
      } catch (e) {
        console.error("Failed to parse user data from localStorage");
      }
    }

    // Only consider authenticated if we have both token AND user data
    if (user) {
      return {
        isAuthenticated: true,
        token: token,
        userId: userId ? parseInt(userId) : null,
        user: user,
        loading: false,
        error: null,
      };
    } else {
      // Token exists but no user data - clear everything
      clearAuthData();
      return {
        isAuthenticated: false,
        token: null,
        userId: null,
        user: null,
        loading: false,
        error: null,
      };
    }
  } else {
    // Clear invalid/expired data
    clearAuthData();

    return {
      isAuthenticated: false,
      token: null,
      userId: null,
      user: null,
      loading: false,
      error: null,
    };
  }
};
