// src/services/productService.ts
import { get, post, put, del } from "./api";
import { AxiosRequestConfig } from "axios";

/**
 * =============================
 * Product Service
 * Handles all product-related API calls
 * =============================
 */

// Define interfaces for product data
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Changed from images[] to match store
  category: string;
  brand?: string;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  reviews?: Review[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  sizes?: string[];
  colors?: string[];
  discountPrice?: number;
  sku?: string;
}

export interface Review {
  _id?: string;
  user: string | { name: string };
  name?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface ProductParams {
  keyword?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  [key: string]: any;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export interface ProductsResponse {
  products: Product[];
  page?: number;
  pages?: number;
  total?: number;
  count?: number;
}

// ✅ Get all products (supports filtering, pagination, and keyword)
export const getProducts = async (params: ProductParams = {}): Promise<ProductsResponse> => {
  try {
    const response = await get("/products", { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch products");
  }
};

// ✅ Get single product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch product");
  }
};

// ✅ Search products by keyword
export const searchProducts = async (keyword: string, params: ProductParams = {}): Promise<ProductsResponse> => {
  try {
    const response = await get("/products", { params: { ...params, keyword } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Search failed");
  }
};

// ✅ Get products by category
export const getProductsByCategory = async (category: string, params: ProductParams = {}): Promise<ProductsResponse> => {
  try {
    const response = await get("/products", { params: { ...params, category } });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch category products");
  }
};

// ✅ Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await get("/categories");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch categories");
  }
};

// ✅ Admin: Create product
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await post("/products", productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to create product");
  }
};

// ✅ Admin: Update product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await put(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update product");
  }
};

// ✅ Admin: Delete product
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await del(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete product");
  }
};

// ✅ Add review to product
export const createProductReview = async (id: string, reviewData: CreateReviewData, token: string): Promise<{ message: string }> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await post(`/products/${id}/reviews`, reviewData, config);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to submit review");
  }
};

// ✅ Admin: Upload single image
export const uploadImage = async (file: File): Promise<{ success: boolean; image: string; public_id?: string }> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await post("/upload", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};

// ✅ Admin: Upload multiple images
export const uploadMultipleImages = async (files: File[]): Promise<{ success: boolean; images: string[] }> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await post("/upload/multiple", formData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to upload images");
  }
};

// ✅ Check if user purchased product (for review eligibility)
export const checkPurchase = async (productId: string): Promise<{ isPaid: boolean }> => {
  try {
    const response = await get(`/orders/check-purchase/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Purchase check failed:", error.response?.data || error);
    return { isPaid: false };
  }
};

// ✅ Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await get("/products/featured");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch featured products");
  }
};

// ✅ Get related products
export const getRelatedProducts = async (productId: string, category: string): Promise<Product[]> => {
  try {
    const response = await get(`/products/${productId}/related`, {
      params: { category }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch related products");
  }
};

// ✅ Export all services together
export default {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  checkPurchase,
  uploadImage,
  uploadMultipleImages,
  getFeaturedProducts,
  getRelatedProducts
};