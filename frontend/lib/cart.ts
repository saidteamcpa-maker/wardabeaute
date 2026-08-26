"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  slug: string;
  qty: number; // 1 | 2 | 3 (offer tier)
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedTier: Record<string, number>;
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  setTier: (slug: string, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      selectedTier: {},
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: item.qty } : i
              ),
              isCartOpen: true,
            };
          }
          return { items: [...s.items, item], isCartOpen: true };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        })),
      setTier: (slug, qty) =>
        set((s) => ({ selectedTier: { ...s.selectedTier, [slug]: qty } })),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      clear: () => set({ items: [], isCartOpen: false, isCheckoutOpen: false }),
    }),
    { name: "warda-cart" }
  )
);
