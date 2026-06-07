"use client";

import { create } from "zustand";

/** Estado de UI do carrinho lateral (drawer). Separado dos itens. */
type CartUI = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCartUI = create<CartUI>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
