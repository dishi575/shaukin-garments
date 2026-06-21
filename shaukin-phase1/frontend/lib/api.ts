import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sg_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("sg_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterPayload) => api.post("/api/auth/register", data),
  login:    (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
  me: () => api.get("/api/auth/me"),
};

// ─── Products ──────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: ProductsParams) => api.get("/api/products", { params }),
  get:  (slug: string)            => api.get(`/api/products/${slug}`),
};

// ─── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get("/api/categories"),
};

// ─── Types ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "retail_customer" | "b2b_client";
  company?: string;
}

export interface ProductsParams {
  category?: string;
  search?: string;
  bulk_only?: boolean;
  retail_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  product_type: string;
  fabric?: string;
  available_sizes?: string[];
  available_colors?: string[];
  price_retail: number;
  price_bulk?: number;
  moq: number;
  stock: number;
  images?: string[];
  is_bulk_available: boolean;
  is_retail_available: boolean;
  category?: { id: string; name: string; slug: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "b2b_client" | "retail_customer";
  company?: string;
  city?: string;
  state?: string;
}
