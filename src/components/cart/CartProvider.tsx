'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export type CartItem = {
  id: string;
  sku: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  price: number; // per-unit price in cents
  qty: number; // number of units
  image: string;
  offerId?: string;
  offerLabelFr?: string;
  offerLabelAr?: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'qty' | 'id'>, qty?: number) => void;
  addOffer: (item: Omit<CartItem, 'id'>) => void;
  addUpsell: (item: Omit<CartItem, 'id'>) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  loaded: boolean;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'warda-cart';

function lineId(item: { sku: string; offerId?: string }) {
  return item.offerId ? `${item.sku}__${item.offerId}` : item.sku;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue['add'] = (item, qty = 1) => {
      const id = lineId(item);
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) {
          return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
        }
        return [...prev, { ...item, id, qty }];
      });
    };

    const addOffer: CartContextValue['addOffer'] = (item) => {
      const id = lineId(item);
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) {
          return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + item.qty } : i));
        }
        return [...prev, { ...item, id }];
      });
    };

    const addUpsell: CartContextValue['addUpsell'] = (item) => {
      const id = lineId(item);
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) return prev;
        return [...prev, { ...item, id, qty: 1 }];
      });
    };

    const remove: CartContextValue['remove'] = (id) =>
      setItems((prev) => prev.filter((i) => i.id !== id));
    const setQty: CartContextValue['setQty'] = (id, qty) =>
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
      );
    const clear = () => setItems([]);

    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);

    return {
      items,
      add,
      addOffer,
      addUpsell,
      remove,
      setQty,
      clear,
      count,
      total,
      loaded,
      open,
      openCart: () => {
        setCheckoutOpen(false);
        setOpen(true);
      },
      closeCart: () => setOpen(false),
      checkoutOpen,
      openCheckout: () => {
        setOpen(false);
        setCheckoutOpen(true);
      },
      closeCheckout: () => setCheckoutOpen(false),
    };
  }, [items, loaded, open, checkoutOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
