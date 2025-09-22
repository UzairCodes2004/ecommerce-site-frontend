// src/components/admin/ProductForm.tsx
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import useProductStore from "../../store/productStore";
import {
  uploadImage as svcUploadImage,
  createProduct as svcCreateProduct,
  updateProduct as svcUpdateProduct,
} from "../../services/productService";
import { Product } from "../../services/productService";

interface ProductFormProps {
  productId?: string;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  price: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
}

interface UploadResponse {
  url?: string;
  image?: string;
  data?: {
    url?: string;
    image?: string;
  };
}

/**
 * ProductForm.tsx
 * - Uploads image to backend (/api/upload) via productService.uploadImage (primary)
 * - Falls back to a direct axios upload if service fails (helps debug proxy/auth issues)
 * - Normalizes backend responses ({ url } or { image } or axios wrapper)
 * - Supports create and update via service functions
 * - Preserves existing image when editing (no new file selected)
 * - Cleans up preview object URLs to avoid memory leaks
 */

const ProductForm: React.FC<ProductFormProps> = ({ productId, onSuccess }) => {
  const { currentProduct, fetchProductById, clearCurrentProduct, fetchProducts } = useProductStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    description: "",
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // Load product for edit mode
  useEffect(() => {
    if (productId) fetchProductById(productId);
    return () => clearCurrentProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Populate when product arrives
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || "",
        price: currentProduct.price?.toString() || "",
        description: currentProduct.description || "",
        image: currentProduct.image || "",
        brand: currentProduct.brand || "",
        category: currentProduct.category || "",
        countInStock: currentProduct.countInStock ?? 0,
      });
      setPreview(currentProduct.image || "");
    }
  }, [currentProduct]);

  // Clean up preview object URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // revoke previous blob URL if present
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setImageFile(file);
      setPreview(url);
    } else {
      // cleared file input
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setImageFile(null);
      setPreview(formData.image || "");
    }
  };

  // Normalize various backend shapes to a single URL string
  const normalizeUploadResponse = (res: UploadResponse | string | any): string => {
    if (!res) return "";
    // res may be:
    // - { url: "...", public_id: "..." }
    // - { image: "..." }
    // - axios response { data: { url: ... } }
    // - or the productService helper might already return response.data
    if (typeof res === "string") return res;
    if (res.url) return res.url;
    if (res.image) return res.image;
    if (res.data) {
      if (res.data.url) return res.data.url;
      if (res.data.image) return res.data.image;
    }
    return "";
  };

  // Primary upload: try service helper; fallback: direct axios (full URL) for debugging
  const doUpload = async (): Promise<string> => {
    if (!imageFile) {
      // No new image chosen — reuse existing URL (could be empty)
      return formData.image || "";
    }

    setUploading(true);
    try {
      // 1) Try productService upload
      try {
        const svcRes = await svcUploadImage(imageFile);
        const url = normalizeUploadResponse(svcRes);
        if (url) {
          setUploading(false);
          console.debug("[ProductForm] uploaded via svcUploadImage ->", url);
          return url;
        }
        // If service returned but no URL, fall through to fallback
        console.warn("[ProductForm] svcUploadImage returned no url. Falling back.");
      } catch (svcErr) {
        console.warn("[ProductForm] svcUploadImage failed, falling back:", (svcErr as Error)?.message || svcErr);
      }

      // 2) Fallback direct axios POST to backend (use full backend URL for debug)
      //    Make sure your backend is running on port 5000 and route is /api/upload
      const token = localStorage.getItem("token"); // adapt if you use cookies or other auth
      const fd = new FormData();
      fd.append("image", imageFile); // MUST be "image" to match upload.single("image")

      const axiosRes = await axios.post("http://localhost:5000/api/upload", fd, {
        headers: {
          // Do NOT set Content-Type manually; axios will set boundary
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const fallbackUrl = normalizeUploadResponse(axiosRes.data ? axiosRes.data : axiosRes);
      setUploading(false);
      if (!fallbackUrl) {
        throw new Error("Upload succeeded but server returned no URL.");
      }
      console.debug("[ProductForm] uploaded via fallback axios ->", fallbackUrl);
      return fallbackUrl;
    } catch (err) {
      setUploading(false);
      console.error("[ProductForm] doUpload error:", (err as any)?.response?.data || (err as Error).message || err);
      throw new Error((err as any)?.response?.data?.message || (err as Error).message || "Image upload failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // 1) Upload image or reuse existing
      const imageUrl = await doUpload();
      if (!imageUrl) {
        setUploading(false);
        alert("Image is required. Please select an image and try again.");
        return;
      }

      // 2) Prepare payload
      const payload: Partial<Product> = {
        name: String(formData.name || "").trim(),
        price: Number(formData.price) || 0,
        description: String(formData.description || "").trim(),
        image: imageUrl,
        brand: String(formData.brand || "").trim(),
        category: String(formData.category || "").trim(),
        countInStock: Number(formData.countInStock) || 0,
      };

      // 3) Basic validation
      if (!payload.name) {
        throw new Error("Product name is required.");
      }

      // 4) Create or update
      if (productId) {
        await svcUpdateProduct(productId, payload);
      } else {
        await svcCreateProduct(payload);
      }

      // 5) Refresh store and callback
      await fetchProducts();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("[ProductForm] Error saving product:", err);
      alert((err as Error).message || "Failed to save product. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {productId ? "Edit Product" : "Create New Product"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["name", "brand", "category", "price", "countInStock"].map((field) => (
          <div key={field} className="space-y-1">
            <label className="block text-sm font-medium text-foreground capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              name={field}
              value={formData[field as keyof FormData] as string | number}
              onChange={handleChange}
              type={field === "price" || field === "countInStock" ? "number" : "text"}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200"
          placeholder="Enter product description"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">Image</label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-border rounded-md file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-colors duration-200"
            />
          </div>
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border border-border shadow-sm"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-32 h-32 border border-dashed border-border rounded-md bg-muted/30">
              <p className="text-sm text-muted-foreground text-center px-2">No image selected</p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 ${
          uploading
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : productId ? (
          "Update Product"
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
};

export default ProductForm;