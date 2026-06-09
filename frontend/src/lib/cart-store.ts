import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./data";

type CartItem = { product: Product; qty: number };

type State = {
  items: CartItem[];
  wishlist: string[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  toggleWish: (id: string) => void;
  clear: () => void;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      add: (p, qty = 1) => {
        const existing = get().items.find((i) => i.product.id === p.id);
        if (existing) {
          set({ items: get().items.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...get().items, { product: p, qty }] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.product.id !== id) }),
      setQty: (id, qty) => set({ items: get().items.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i) }),
      toggleWish: (id) => set({
        wishlist: get().wishlist.includes(id)
          ? get().wishlist.filter((w) => w !== id)
          : [...get().wishlist, id],
      }),
      clear: () => set({ items: [] }),
    }),
    { name: "hmhw-cart" }
  )
);

export const cartTotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.product.price * i.qty, 0);
export const cartCount = (items: CartItem[]) =>
  items.reduce((s, i) => s + i.qty, 0);
