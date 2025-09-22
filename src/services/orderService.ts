// src/services/orderService.ts
import { post, get, put, del } from "./api";
import { OrderItem } from "../types/order";
// Define interfaces for order data


export interface ShippingAddress {
  
  address: string;
  city: string;
  postalCode: string;
  country: string;
 
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time?: string;
  email_address?: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  isShipped: boolean;
  shippedAt?: string;
  isCancelled: boolean;
  cancelledAt?: string;
  refundStatus?: 'pending' | 'processed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

/**
 * Place a new order (Private)
 */
export const placeOrder = async (orderData: OrderData): Promise<Order> => {
  try {
    const response = await post("/orders", {
      ...orderData,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to place order"
    );
  }
};

/**
 * Get current user's orders
 */
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    const response = await get("/orders/myorders");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch your orders");
  }
};

/**
 * Get order details by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await get(`/orders/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch order details");
  }
};

/**
 * Mark order as paid
 */
export const payOrder = async (id: string, paymentResult: PaymentResult): Promise<Order> => {
  try {
    const response = await put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update order as paid");
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (id: string): Promise<Order> => {
  try {
    const response = await put(`/orders/${id}/cancel`, {});
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to cancel order";
    throw new Error(message);
  }
};

/**
 * Admin: get all orders
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await get("/orders");

    // Normalize the data so it's always an array
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.orders) return data.orders;
    if (data?.results) return data.results;

    return []; // fallback to empty array
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    return []; // return empty array instead of throwing
  }
};

/**
 * Admin: delete order
 */
export const deleteOrder = async (orderId: string): Promise<any> => {
  try {
    const response = await del(`/orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete order");
  }
};

/**
 * User: mark order as delivered
 */
export const markOrderAsDelivered = async (orderId: string): Promise<Order> => {
  try {
    const response = await put(`/orders/${orderId}/receive`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to mark order as delivered"
    );
  }
};

/**
 * Mark order as shipped
 */
export const markOrderAsShipped = async (id: string): Promise<Order> => {
  try {
    const response = await put(`/orders/${id}/ship`, {});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to mark order as shipped");
  }
};

/**
 * Admin: Mark order as paid (Admin only)
 */
export const markAsPaid = async (id: string, adminNote: string = ""): Promise<Order> => {
  try {
    const response = await put(`/orders/${id}/mark-paid`, {
      adminNote: adminNote || "Manually marked as paid by admin"
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to mark order as paid"
    );
  }
};

/**
 * Admin: Process refund for cancelled order
 */
export const refundCancelledOrder = async (id: string): Promise<Order> => {
  try {
    const response = await put(`/orders/${id}/refund`, {});
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to process refund";
    throw new Error(message);
  }
};

export default {
  placeOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  cancelOrder,
  getAllOrders,
  deleteOrder,
  markOrderAsDelivered,
  markOrderAsShipped,
  markAsPaid,
  refundCancelledOrder
};