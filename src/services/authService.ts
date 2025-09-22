// src/services/authService.ts
import { post, get, put } from "./api";

// Define interfaces for user data
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

// Login user
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await post("/auth/login", { email, password });
  return response.data;
};

// Register new user
export const register = async (
  userData: Partial<User> & { password: string }
): Promise<AuthResponse> => {
  const response = await post("/auth/register", userData);
  return response.data;
};

// Get user profile
export const getProfile = async (): Promise<User> => {
  const response = await get("/auth/profile");
  return response.data;
};

// Update user profile
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await put("/users/profile", userData);
  return response.data;
};

// Logout user (optional - mainly frontend)
export const logout = async (): Promise<void> => {
  try {
    await post("/auth/logout");
  } catch (error) {
    console.log(
      "Logout API call failed, proceeding with frontend logout",
      error
    );
  }
};

export default {
  login,
  register,
  getProfile,
  updateProfile,
  logout,
};
