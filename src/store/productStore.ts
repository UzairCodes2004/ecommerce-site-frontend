// src/store/productStore.ts
import { create } from "zustand";
import * as productService from "../services/productService";
import { Product as ServiceProduct, ProductsResponse } from "../services/productService";

// TYPES
export interface Product extends Omit<ServiceProduct, 'images'> {
  image: string; // Single image for store compatibility
}

export interface Category {
  _id: string;
  name: string;
}

export interface Pagination {
  page: number;
  pages: number;
  total: number;
}

export interface Filters {
  keyword: string;
  category: string;
  sort: "newest" | "price-low" | "price-high" | "name-asc" | "name-desc";
  page: number;
  limit: number;
}

export interface ProductState {
  // STATE
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: Filters;

  // ACTIONS
  setFilters: (newFilters: Partial<Filters>, options?: { immediate?: boolean }) => void;
  setSort: (sortOption: Filters["sort"]) => void;
  clearFilters: () => void;
  fetchProducts: (filters?: Partial<Filters>) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  clearCurrentProduct: () => void;
  createProduct: (productData: Omit<Product, "_id" | "createdAt" | "updatedAt">) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

const useProductStore = create<ProductState>((set, get) => ({
  // STATE
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
  filters: {
    keyword: "",
    category: "",
    sort: "newest",
    page: 1,
    limit: 12,
  },

  // ACTIONS
  setFilters: (newFilters, { immediate = false } = {}) => {
    const updatedFilters = { ...get().filters, ...newFilters };
    set({ filters: updatedFilters });

    if (immediate) {
      get().fetchProducts(updatedFilters);
    }
  },

  setSort: (sortOption) => {
    const updatedFilters = { ...get().filters, sort: sortOption, page: 1 };
    set({ filters: updatedFilters });
    get().fetchProducts(updatedFilters);
  },

  clearFilters: () => {
    const defaultFilters: Filters = {
      keyword: "",
      category: "",
      sort: "newest",
      page: 1,
      limit: 12,
    };
    set({ filters: defaultFilters });
    get().fetchProducts(defaultFilters);
  },

  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };

      // Convert frontend sort to backend
      const sortMap: Record<Filters["sort"], string> = {
        newest: "-createdAt",
        "price-low": "price",
        "price-high": "-price",
        "name-asc": "name",
        "name-desc": "-name",
      };
      const backendFilters = {
        ...currentFilters,
        sort: sortMap[currentFilters.sort] || "-createdAt",
      };

      const data: ProductsResponse = await productService.getProducts(backendFilters);

      set({
        products: data.products || [],
        pagination: {
          page: data.page || currentFilters.page || 1,
          pages: data.pages || 1,
          total: data.total || data.count || (Array.isArray(data) ? data.length : 0),
        },
        filters: currentFilters,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.getProductById(id);
      set({ currentProduct: product });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await productService.getCategories();
      // Convert string array to Category objects
      const categoryObjects: Category[] = categories.map((cat, index) => ({
        _id: `cat-${index}`,
        name: cat
      }));
      set({ categories: categoryObjects });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const data: ProductsResponse = await productService.getProductsByCategory(category);
      set({
        products: data.products || [],
        pagination: {
          page: data.page || 1,
          pages: data.pages || 1,
          total: data.total || data.count || data.products?.length || 0,
        },
        filters: { ...get().filters, category },
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentProduct: () => {
    set({ currentProduct: null });
  },

  // ✅ CREATE PRODUCT
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const product = await productService.createProduct(productData);
      // Refresh products list after create
      get().fetchProducts();
      return product;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ UPDATE PRODUCT
  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const updated = await productService.updateProduct(id, productData);
      // Refresh products list after update
      get().fetchProducts();
      return updated;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ✅ DELETE PRODUCT
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      // Refresh products list after delete
      get().fetchProducts();
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;