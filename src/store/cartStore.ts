// stores/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

// Interfaces
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number; 
  cartItemId: string;
  size?: string;
  color?: string;
  [key: string]: any;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  currentUserId: string;

  initialize: () => void;
  setUser: (userId: string) => void;
  addToCart: (product: CartItem, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  clearCart: () => void;
  forceClearAllCartData: () => void;
  refreshCartState: () => void;
  isInCart: (productId: string) => boolean;
}

// Utility: calculate totals
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );
  const itemCount = items.reduce(
    (count, item) => count + (item.quantity || 0),
    0
  );
  return { total, itemCount };
};

// Get current user ID for storage key
const getCurrentUserId = (): string => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user?._id ? `user-${user._id}` : "guest";
    }
  } catch (err) {
    console.warn("User info parse error:", err);
  }
  return "guest";
};

// Cart store
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      currentUserId: "guest",

      initialize: () => {
        const userId = getCurrentUserId();
        set({ currentUserId: userId });
      },

      setUser: (userId: string = "guest") => {
        const currentState = get();

        if (currentState.currentUserId) {
          localStorage.setItem(
            `cart-${currentState.currentUserId}`,
            JSON.stringify({
              items: currentState.items,
              total: currentState.total,
              itemCount: currentState.itemCount,
            })
          );
        }

        const newCartData = localStorage.getItem(`cart-${userId}`);
        if (newCartData) {
          try {
            const parsed = JSON.parse(newCartData);
            set({
              items: parsed.items || [],
              total: parsed.total || 0,
              itemCount: parsed.itemCount || 0,
              currentUserId: userId,
            });
          } catch (error) {
            console.error("Error loading cart:", error);
            set({ items: [], total: 0, itemCount: 0, currentUserId: userId });
          }
        } else {
          set({ items: [], total: 0, itemCount: 0, currentUserId: userId });
        }
      },

      addToCart: (product: CartItem, qty: number = 1) => {
        if (!product || !product._id) return;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item._id === product._id
          );

          let newItems: CartItem[];
          if (existingIndex > -1) {
            // Update quantity
            newItems = state.items.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: (item.quantity || 0) + qty }
                : item
            );
          } else {
            // Add new product
            newItems = [
              ...state.items,
              {
                ...product,
                quantity: qty,
                cartItemId: nanoid(),
              },
            ];
          }

          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      removeFromCart: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      increaseQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          );
          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      decreaseQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items
            .map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: Math.max(0, (item.quantity || 0) - 1) }
                : item
            )
            .filter((item) => item.quantity > 0);

          const { total, itemCount } = calculateTotals(newItems);
          return { items: newItems, total, itemCount };
        });
      },

      clearCart: () => {
        const currentState = get();
        set({ items: [], total: 0, itemCount: 0 });
        if (currentState.currentUserId) {
          localStorage.removeItem(`cart-${currentState.currentUserId}`);
        }
        localStorage.removeItem("cart-storage");
      },

      forceClearAllCartData: () => {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith("cart-") || key === "cart-storage") {
            localStorage.removeItem(key);
          }
        });
        set({ items: [], total: 0, itemCount: 0 });
      },

      refreshCartState: () => {
        const userId = getCurrentUserId();
        const cartData = localStorage.getItem(`cart-${userId}`);
        if (cartData) {
          try {
            const parsed = JSON.parse(cartData);
            set({
              items: parsed.items || [],
              total: parsed.total || 0,
              itemCount: parsed.itemCount || 0,
              currentUserId: userId,
            });
          } catch {
            set({ items: [], total: 0, itemCount: 0, currentUserId: userId });
          }
        } else {
          set({ items: [], total: 0, itemCount: 0, currentUserId: userId });
        }
      },

      isInCart: (productId: string) => {
        return get().items.some((item) => item._id === productId);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage as StateStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
    }
  )
);

export default useCartStore;
