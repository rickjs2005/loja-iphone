"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Carrinho 100% no client (sem checkout/pagamento). Persistido em localStorage
 * para sobreviver a refresh. O fechamento acontece via WhatsApp.
 */

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  stock: number;
  category: "iphone" | "accessory";
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const clamp = (qty: number, stock: number) =>
  Math.max(1, Math.min(qty, Math.max(1, stock)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: clamp(i.quantity + quantity, i.stock) }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: clamp(quantity, item.stock) },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: clamp(quantity, i.stock) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "loja-iphone-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Selectors derivados (evitam recálculo espalhado pelos componentes).
export const selectTotalItems = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectTotalCents = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

export const selectHasIphone = (s: CartState) =>
  s.items.some((i) => i.category === "iphone");
