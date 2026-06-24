import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, qty = 1) => {
        set(state => {
          const existing = state.items.find(i => i.id === item.id);
          if (existing) {
            return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i) };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        });
      },

      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return; }
        set(state => ({ items: state.items.map(i => i.id === id ? { ...i, quantity: qty } : i) }));
      },

      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "shaukin-cart" }
  )
);
