import api from "./api"; // axios instance
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}
// Define interfaces for user data
export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string;
  updatedAt?: string;
  token?: string; // Add token for update responses
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
}
export interface UserProfileResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export interface LoginResponse {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

// ==================== Admin APIs ====================

// Get all users (for admin dashboard)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data } = await api.get("/users");
    return data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get single user by ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error: any) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: any) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

// Promote user to admin (based on your backend, it uses email, not ID)
export const promoteToAdmin = async (
  email: string
): Promise<{ user: User; token: string }> => {
  try {
    const { data } = await api.put("/users/promote-to-admin", { email });
    return data;
  } catch (error: any) {
    console.error(`Error promoting user with email ${email} to admin:`, error);
    throw error;
  }
};

// ==================== Normal User APIs ====================

// Get current user profile
export const getProfile = async (): Promise<User> => {
  try {
    const { data } = await api.get("/users/profile");
    return data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Update own profile
// In your updateProfile function in userService.ts
export const updateProfile = async (userData: any): Promise<UserProfileResponse> => {
  try {
    console.log("Sending update profile request:", userData); // Add this log
    const { data } = await api.put("/users/profile", userData);
    console.log("Update profile response:", data); // Add this log
    return data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    console.error("Error details:", error.response?.data); // Add this
    throw error;
  }
};

// Optional: Update specific profile fields separately
export const updateName = async (name: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.put("/users/profile", { name });
    return data;
  } catch (error: any) {
    console.error("Error updating name:", error);
    throw error;
  }
};

export const updateEmail = async (email: string): Promise<LoginResponse> => {
  try {
    const { data } = await api.put("/users/profile", { email });
    return data;
  } catch (error: any) {
    console.error("Error updating email:", error);
    throw error;
  }
};

export const updatePassword = async (
  password: string
): Promise<LoginResponse> => {
  try {
    const { data } = await api.put("/users/profile", { password });
    return data;
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Export all functions
export default {
  // Admin functions
  getAllUsers,
  getUserById,
  deleteUser,
  promoteToAdmin,
  getProfile,
  updateProfile,
  updateName,
  updateEmail,
  updatePassword,
};
