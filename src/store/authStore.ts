// src/store/authStore.ts
import { create } from "zustand";
import * as authService from "../services/authService";
import * as userService from "../services/userService"; // Import userService
import type { AuthResponse } from "../services/authService";
import useCartStore from "./cartStore";

// Local user representation
export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

// Update AuthResponse to match your backend response
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;

  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (userData: any) => Promise<{ user: User; token: string }>;
  logout: () => void;
  getProfile: () => Promise<User>;
  updateProfile: (userData: any) => Promise<{ user: User; token: string }>;
  clearError: () => void;
  clearFieldError: (field: string) => void;
  initializeAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
  fieldErrors: null,

  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
      useCartStore.getState().setUser(user._id);
    } else {
      localStorage.removeItem("userInfo");
      useCartStore.getState().setUser("guest");
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, fieldErrors: null });
    try {
      const data: AuthResponse = await authService.login(email, password);

      // Normalize response into local User shape
      const token = data.token;
      const user: User = {
        _id: data.user?._id ?? data._id ?? "",
        name: data.user?.name ?? data.name ?? "",
        email: data.user?.email ?? data.email ?? "",
        isAdmin: data.user?.isAdmin ?? data.isAdmin ?? false,
      };

      if (!token || !user._id) throw new Error("Invalid login response");

      set({ user, token });
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      useCartStore.getState().setUser(user._id);

      return { user, token };
    } catch (error: any) {
      const errorMessage =
        error?.friendlyMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Login failed";

      set({
        error: errorMessage,
        fieldErrors: error?.response?.data?.errors || null,
        user: null,
        token: null,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      useCartStore.getState().setUser("guest");

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true, error: null, fieldErrors: null });
    try {
      const data: AuthResponse = await authService.register(userData);

      const token = data.token;
      const user: User = {
        _id: data.user?._id ?? data._id ?? "",
        name: data.user?.name ?? data.name ?? "",
        email: data.user?.email ?? data.email ?? "",
        isAdmin: data.user?.isAdmin ?? data.isAdmin ?? false,
      };

      if (!token || !user._id) throw new Error("Invalid registration response");

      set({ user, token });
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      useCartStore.getState().setUser(user._id);

      return { user, token };
    } catch (error: any) {
      const errorMessage =
        error?.friendlyMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";

      set({
        error: errorMessage,
        fieldErrors: error?.response?.data?.errors || null,
        user: null,
        token: null,
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      useCartStore.getState().setUser("guest");

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null, fieldErrors: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    useCartStore.getState().setUser("guest");
  },

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // Use userService for getting profile (more appropriate)
      const data = await userService.getProfile();

      const user: User = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };

      set({ user });
      localStorage.setItem("userInfo", JSON.stringify(user));
      useCartStore.getState().setUser(user._id);

      return user;
    } catch (error: any) {
      const errorMessage =
        error?.friendlyMessage ||
        error?.response?.data?.message ||
        error.message ||
        "Profile fetch failed";

      set({ error: errorMessage, user: null, token: null });
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      useCartStore.getState().setUser("guest");

      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (userData: any) => {
  set({ isLoading: true, error: null, fieldErrors: null });
  try {
    const data = await userService.updateProfile(userData);

    const user: User = {
      _id: data._id,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin,
    };

    if (!user._id) throw new Error("Invalid profile update response");

    // ✅ store the refreshed token
    set({ user, token: data.token });
    localStorage.setItem("token", data.token);
    localStorage.setItem("userInfo", JSON.stringify(user));
    useCartStore.getState().setUser(user._id);

    return { user, token: data.token };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error.message || "Profile update failed";
    set({ error: errorMessage });
    throw new Error(errorMessage);
  } finally {
    set({ isLoading: false });
  }
},


  clearError: () => set({ error: null, fieldErrors: null }),

  clearFieldError: (field) => {
    set((state) => {
      if (!state.fieldErrors) return { fieldErrors: null };

      const newFieldErrors = { ...state.fieldErrors };
      delete newFieldErrors[field];

      return { fieldErrors: Object.keys(newFieldErrors).length ? newFieldErrors : null };
    });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      try {
        const user: User = JSON.parse(userInfo);
        set({ user, token });
        useCartStore.getState().setUser(user._id);
      } catch (error) {
        console.error("Auth init error", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        set({ user: null, token: null });
        useCartStore.getState().setUser("guest");
      }
    } else {
      useCartStore.getState().setUser("guest");
    }
  },
}));

export default useAuthStore;