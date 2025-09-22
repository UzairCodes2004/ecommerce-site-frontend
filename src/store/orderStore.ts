// src/store/orderStore.ts
import { create } from "zustand";
import * as orderService from "../services/orderService";
import { Order, PaymentResult } from "../services/orderService"; // Updated import

interface OrderState {
  myOrders: Order[];
  currentOrder: Order | null;
  allOrders: Order[];
  loading: boolean;
  error: string | null;

  // Actionsa
  placeOrder: (orderData: OrderData) => Promise<Order>;
  fetchMyOrders: () => Promise<Order[]>;
  fetchOrderById: (id: string) => Promise<Order>;
  payOrder: (id: string, paymentResult: PaymentResult) => Promise<Order>;
  cancelOrder: (id: string) => Promise<Order>;
  fetchAllOrders: () => Promise<Order[]>;
  deleteOrder: (id: string) => Promise<void>;
  markAsDelivered: (id: string) => Promise<Order>;
  shipOrder: (id: string) => Promise<Order>;
  markAsPaid: (id: string, adminNote?: string) => Promise<Order>;
  refundCancelledOrder: (id: string) => Promise<Order>;
  clearError: () => void;
  clearCurrentOrder: () => void;
  setCurrentOrder: (order: Order | null) => void;
}

// Define the order data structure for placing orders
import { OrderData as ServiceOrderData } from "../services/orderService";

type OrderData = ServiceOrderData;

const useOrderStore = create<OrderState>((set, get) => ({
  myOrders: [],
  currentOrder: null,
  allOrders: [],
  loading: false,
  error: null,

  // =====================
  // Place new order
  // =====================
  placeOrder: async (orderData: OrderData) => {
    set({ loading: true, error: null });
    try {
      const result = await orderService.placeOrder(orderData);
      set((state) => ({ myOrders: [result, ...state.myOrders] }));
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Order failed";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Get logged-in user's orders
  // =====================
  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getMyOrders();
      set({ myOrders: data });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Get order details by ID
  // =====================
  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getOrderById(id);
      set({ currentOrder: data });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch order";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Mark order as paid
  // =====================
  payOrder: async (id: string, paymentResult: PaymentResult) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.payOrder(id, paymentResult);
      set((state) => ({
        currentOrder: data,
        myOrders: state.myOrders.map((o) => (o._id === id ? data : o)),
      }));
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark paid";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Cancel an order
  // =====================
  cancelOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await orderService.cancelOrder(id);

      set((state) => {
        const update = (orders: Order[]) =>
          orders.map((o) => (o._id === id ? updatedOrder : o));

        return {
          currentOrder:
            state.currentOrder?._id === id ? updatedOrder : state.currentOrder,
          myOrders: update(state.myOrders),
          allOrders: update(state.allOrders),
        };
      });

      return updatedOrder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel order";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Admin: fetch all orders
  // =====================
  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.getAllOrders();
      set({ allOrders: data });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch all orders";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Admin: delete order
  // =====================
  deleteOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await orderService.deleteOrder(id);
      set((state) => ({
        allOrders: state.allOrders.filter((o) => o._id !== id),
        myOrders: state.myOrders.filter((o) => o._id !== id),
      }));
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete order";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // User: mark as delivered
  // =====================
  markAsDelivered: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const updatedOrder = await orderService.markOrderAsDelivered(id);

      set((state) => {
        const update = (orders: Order[]) =>
          orders.map((o) => (o._id === id ? updatedOrder : o));

        return {
          currentOrder:
            state.currentOrder?._id === id ? updatedOrder : state.currentOrder,
          myOrders: update(state.myOrders),
          allOrders: update(state.allOrders),
        };
      });

      return updatedOrder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark delivered";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Admin: ship order
  // =====================
  shipOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await orderService.markOrderAsShipped(id);
      set((state) => {
        const update = (orders: Order[]) =>
          orders.map((o) => (o._id === id ? { ...o, isShipped: true, shippedAt: new Date().toISOString() } : o));

        return {
          allOrders: update(state.allOrders),
          myOrders: update(state.myOrders),
          currentOrder: state.currentOrder?._id === id ? data : state.currentOrder,
        };
      });
      return data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to ship order";
      set({ error: errorMessage });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // Admin: Mark order as paid (Admin only)
  // =====================
  markAsPaid: async (id: string, adminNote: string = "") => {
    const prevOrders = get().allOrders;
    const prevMyOrders = get().myOrders;
    const prevCurrentOrder = get().currentOrder;

    const findMatch = (o: Order) => o._id === id;
    
    // Apply optimistic updates
    set((state) => ({
      allOrders: state.allOrders.map((o) => (findMatch(o) ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o)),
      myOrders: state.myOrders.map((o) => (findMatch(o) ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o)),
      currentOrder: state.currentOrder && findMatch(state.currentOrder)
        ? { ...state.currentOrder, isPaid: true, paidAt: new Date().toISOString() }
        : state.currentOrder,
      loading: true,
      error: null,
    }));

    try {
      const updatedOrder = await orderService.markAsPaid(id, adminNote);

      set((state) => ({
        allOrders: state.allOrders.map((o) => o._id === updatedOrder._id ? updatedOrder : o),
        myOrders: state.myOrders.map((o) => o._id === updatedOrder._id ? updatedOrder : o),
        currentOrder: state.currentOrder?._id === updatedOrder._id ? updatedOrder : state.currentOrder,
        loading: false,
        error: null,
      }));

      return updatedOrder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark order as paid";
      set({
        allOrders: prevOrders,
        myOrders: prevMyOrders,
        currentOrder: prevCurrentOrder,
        loading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  // =====================
  // Admin: Process refund for cancelled order
  // =====================
  refundCancelledOrder: async (id: string) => {
    const prevOrders = get().allOrders;
    const prevMyOrders = get().myOrders;
    const prevCurrentOrder = get().currentOrder;

    const findMatch = (o: Order) => o._id === id;
    
    // Apply optimistic updates
    set((state) => ({
      allOrders: state.allOrders.map((o) => (findMatch(o) ? { ...o, refundStatus: 'processed' } : o)),
      myOrders: state.myOrders.map((o) => (findMatch(o) ? { ...o, refundStatus: 'processed' } : o)),
      currentOrder: state.currentOrder && findMatch(state.currentOrder)
        ? { ...state.currentOrder, refundStatus: 'processed' }
        : state.currentOrder,
      loading: true,
      error: null,
    }));

    try {
      const updatedOrder = await orderService.refundCancelledOrder(id);

      set((state) => ({
        allOrders: state.allOrders.map((o) => o._id === updatedOrder._id ? updatedOrder : o),
        myOrders: state.myOrders.map((o) => o._id === updatedOrder._id ? updatedOrder : o),
        currentOrder: state.currentOrder?._id === updatedOrder._id ? updatedOrder : state.currentOrder,
        loading: false,
        error: null,
      }));

      return updatedOrder;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process refund";
      set({
        allOrders: prevOrders,
        myOrders: prevMyOrders,
        currentOrder: prevCurrentOrder,
        loading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  // =====================
  // Utilities
  // =====================
  clearError: () => set({ error: null }),
  clearCurrentOrder: () => set({ currentOrder: null }),
  setCurrentOrder: (order: Order | null) => set({ currentOrder: order }),
}));

export default useOrderStore;