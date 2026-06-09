// API Client for H.M Herbal World Full-Stack E-commerce

import type { Product } from "./data";

export type Category = {
  _id?: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
};

export type Slide = {
  _id?: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  active?: boolean;
};

export type OrderItem = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
  qty: number;
};

export type Order = {
  _id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "COD" | "Razorpay";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt?: string;
};

// Generic request helper with JSON parsing and error handling
async function request(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// 1. Auth API
export const apiLogin = async (username: string, password: string) => {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
};

// 2. Product API
export const apiFetchProducts = async (): Promise<Product[]> => {
  return request("/api/products");
};

export const apiFetchProduct = async (slug: string): Promise<Product> => {
  return request(`/api/products/${slug}`);
};

export const apiCreateProduct = async (productData: any, token: string) => {
  return request("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
};

export const apiUpdateProduct = async (id: string, productData: any, token: string) => {
  return request(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
};

export const apiDeleteProduct = async (id: string, token: string) => {
  return request(`/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 3. Category API
export const apiFetchCategories = async (): Promise<Category[]> => {
  return request("/api/categories");
};

export const apiCreateCategory = async (categoryData: any, token: string) => {
  return request("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
};

export const apiUpdateCategory = async (id: string, categoryData: any, token: string) => {
  return request(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
};

export const apiDeleteCategory = async (id: string, token: string) => {
  return request(`/api/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 4. Slider API
export const apiFetchSliders = async (): Promise<Slide[]> => {
  return request("/api/sliders");
};

export const apiFetchSlidersAdmin = async (token: string): Promise<Slide[]> => {
  return request("/api/sliders/admin", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiUpdateSliders = async (slides: Slide[], token: string) => {
  return request("/api/sliders", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slides }),
  });
};

// 5. Order API
export const apiCreateOrder = async (orderData: any) => {
  return request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
};

export const apiVerifyPayment = async (verificationData: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) => {
  return request("/api/orders/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(verificationData),
  });
};

export const apiFetchOrders = async (token: string): Promise<Order[]> => {
  return request("/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiUpdateOrderStatus = async (id: string, orderStatus: string, token: string) => {
  return request(`/api/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderStatus }),
  });
};

// 6. Upload API
export const apiUploadImage = async (file: File, token: string): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image");
  }
  return data;
};
