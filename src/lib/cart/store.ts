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

/** Estado fresco de um produto, como retornado pela camada de dados. */
export type ServerProductState = {
  id: string;
  price_cents: number;
  stock: number;
  is_active: boolean;
};

type CartState = {
  items: CartItem[];
  /** Se a última sync com o servidor alterou algo (não persiste). */
  lastSyncChanged: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  syncWithServer: (state: ServerProductState[]) => void;
};

const clamp = (qty: number, stock: number) =>
  Math.max(1, Math.min(qty, Math.max(1, stock)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      lastSyncChanged: false,

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

      /**
       * Reconcilia o carrinho com o estado fresco do banco: remove o que
       * sumiu/foi desativado/zerou o estoque e atualiza preço/estoque dos
       * demais (clampando a quantidade). Registra em `lastSyncChanged` se a
       * sync alterou algo, para a UI avisar o cliente.
       */
      syncWithServer: (server) =>
        set((state) => {
          const byId = new Map(server.map((p) => [p.id, p]));
          let changed = false;
          const items: CartItem[] = [];

          for (const item of state.items) {
            const fresh = byId.get(item.productId);
            // Produto removido, desativado ou esgotado: sai do carrinho.
            if (!fresh || !fresh.is_active || fresh.stock <= 0) {
              changed = true;
              continue;
            }
            const quantity = clamp(item.quantity, fresh.stock);
            if (
              fresh.price_cents !== item.priceCents ||
              fresh.stock !== item.stock ||
              quantity !== item.quantity
            ) {
              changed = true;
              items.push({
                ...item,
                priceCents: fresh.price_cents,
                stock: fresh.stock,
                quantity,
              });
            } else {
              items.push(item);
            }
          }

          return changed
            ? { items, lastSyncChanged: true }
            : { lastSyncChanged: false };
        }),
    }),
    {
      name: "loja-iphone-cart",
      storage: createJSONStorage(() => localStorage),
      // Só os itens vão pro localStorage; flags transitórias ficam de fora.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Selectors derivados (evitam recálculo espalhado pelos componentes).
export const selectTotalItems = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectTotalCents = (s: CartState) =>
  s.items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

/** Há algum aparelho (não-acessório) no carrinho? Dispara o upsell. */
export const selectHasDevice = (s: CartState) =>
  s.items.some((i) => i.category !== "accessory");
