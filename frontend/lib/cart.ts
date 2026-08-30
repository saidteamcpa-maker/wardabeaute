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
    {
      name: "warda-cart",
      // Only persist cart data, not UI open flags — prevents checkout popup showing on reload
      partialize: (state) => ({ items: state.items, selectedTier: state.selectedTier }),
      // Migrate old persisted data: filter out invalid slugs (e.g. bundle-bck, upsell-99)
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          const validSlugs = new Set(["velvastretch", "silkstop", "collaglow", "kit-collagene"]);
          const before = state.items.length;
          state.items = state.items.filter((i: any) => i && typeof i.slug === "string" && validSlugs.has(i.slug) && typeof i.qty === "number" && i.qty >= 1 && i.qty <= 20);
          if (state.items.length !== before) {
            // Force UI closed if we cleaned cart
            state.isCartOpen = false;
            state.isCheckoutOpen = false;
          }
        }
        // Fix silkstop default was 3 but should be 2 — correct persisted value
        if (state && state.selectedTier && state.selectedTier["silkstop"] === 3) {
          state.selectedTier["silkstop"] = 2;
        }
        // Always start with UI closed on rehydrate
        if (state) {
          state.isCartOpen = false;
          state.isCheckoutOpen = false;
        }
      },
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // v1 stored isCartOpen/isCheckoutOpen — drop them
          const s = persistedState as any;
          if (s) {
            s.isCartOpen = false;
            s.isCheckoutOpen = false;
            if (Array.isArray(s.items)) {
              const valid = new Set(["velvastretch", "silkstop", "collaglow", "kit-collagene"]);
              s.items = s.items.filter((i: any) => i && valid.has(i.slug));
            }
          }
        }
        if (version < 3) {
          const s = persistedState as any;
          if (s && s.selectedTier && s.selectedTier["silkstop"] === 3) {
            s.selectedTier["silkstop"] = 2;
          }
        }
        return persistedState as CartState;
      },
    }
  )
);
