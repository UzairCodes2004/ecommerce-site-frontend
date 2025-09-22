import api from "./api"; // axios instance

// Define interfaces for user data
export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isVerified?: boolean;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  password: string;
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

// Promote user to admin
export const promoteToAdmin = async (id: string): Promise<User> => {
  try {
    const { data } = await api.put("/users/promote-to-admin", { id });
    return data;
  } catch (error: any) {
    console.error(`Error promoting user with ID ${id} to admin:`, error);
    throw error;
  }
};

// ==================== Normal User APIs ====================

// Update own profile
export const updateProfile = async (
  profileData: UpdateProfileData
): Promise<User> => {
  try {
    const { data } = await api.put("/users/profile", profileData);
    return data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Export all functions
export default {
  getAllUsers,
  getUserById,
  deleteUser,
  promoteToAdmin,
  updateProfile,
};
