import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Define types for error response structure
interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: ValidationError[] | Record<string, string>;
}

interface ValidationError {
  path?: string;
  param?: string;
  field?: string;
  msg?: string;
  message?: string;
}

// Extend AxiosError to include our custom properties
interface CustomAxiosError extends AxiosError {
  validationErrors?: Record<string, string>;
  friendlyMessage?: string;
}

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    // ⛔ Don't attach token on login or register
    if (
      token &&
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: CustomAxiosError) => {
    const status = error.response?.status;
    const serverMessage =
      (error.response?.data as ErrorResponse)?.message ||
      (error.response?.data as ErrorResponse)?.error;
    const requestUrl = error.config?.url || "";
    const isLogin = requestUrl.includes("/auth/login");

    let friendly = serverMessage;
    if (status === 401) {
      friendly = isLogin
        ? "Email or password is incorrect."
        : "Please log in to continue.";
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("unauthorized"));
    } else if (status === 403) {
      friendly = "You don't have permission to perform this action.";
    } else if (status === 400) {
      friendly = serverMessage || "Please check your input and try again.";
    } else if (status && status >= 500) {
      // If this was a login attempt but server returned 500, prefer a credential message
      if (isLogin) {
        friendly = "Email or password is incorrect.";
      } else {
        console.error("Server error:", error.response?.data);
        friendly = "Something went wrong on our side. Please try again.";
      }
    }

    // Normalize validation errors to a simple key->message map
    const rawErrors = (error.response?.data as ErrorResponse)?.errors;
    if (Array.isArray(rawErrors)) {
      const mapped: Record<string, string> = {};
      rawErrors.forEach((e: ValidationError) => {
        const key = e.path || e.param || e.field || "form";
        const message =
          e.msg || e.message || serverMessage || "Validation error";
        mapped[key] = message;
      });
      error.validationErrors = mapped;
    } else if (rawErrors && typeof rawErrors === "object") {
      error.validationErrors = rawErrors as Record<string, string>;
    }

    // For login failures, attach field-level hints if none provided
    if (isLogin) {
      const msg = (serverMessage || "").toLowerCase();
      if (!error.validationErrors) {
        if (
          msg.includes("email") ||
          msg.includes("user") ||
          msg.includes("not found")
        ) {
          error.validationErrors = { email: "Incorrect email" };
        } else {
          error.validationErrors = { password: "Incorrect password" };
        }
      }
    }

    error.friendlyMessage = friendly;
    return Promise.reject(error);
  }
);

// API methods with proper typing - use AxiosRequestConfig for public methods
export const get = (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => api.get(url, config);

export const post = (
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => api.post(url, data, config);

export const put = (
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => api.put(url, data, config);

export const del = (
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => api.delete(url, config);

export const patch = (
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse> => api.patch(url, data, config);

export default api;
