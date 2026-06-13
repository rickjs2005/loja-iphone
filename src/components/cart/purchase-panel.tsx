"use client";

import { useEffect, useRef, useState } from "react";
import { Button, focusRing } from "@/components/ui/button";
import { CartIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";

/** Seletor de quantidade + comprar no WhatsApp + adicionar ao carrinho (PDP). */
export function PurchasePanel({
  product,
}: {
  product: Omit<CartItem, "quantity">;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esgotado = product.stock <= 0;
  const max = Math.max(1, product.stock);

  // Cancela o timer pendente ao desmontar (evita setState em componente morto).
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  function handleAdd() {
    addItem(product, qty);
    openCart();
    setAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 1500);
  }

  if (esgotado) {
    return (
      <Button variant="outline" size="lg" disabled className="w-full">
        Produto esgotado
      </Button>
    );
  }

  // Um único CTA: adicionar ao carrinho. A compra fecha SEMPRE pelo
  // carrinho ("Finalizar no WhatsApp") — decisão do dono: sem compra direta.
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-13 items-center justify-between rounded-xl border border-white/15 bg-surface/60 px-2 sm:w-36">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Diminuir"
            className={`inline-flex size-11 items-center justify-center rounded-lg text-fg transition-colors hover:bg-white/5 disabled:opacity-40 ${focusRing}`}
          >
            <MinusIcon className="size-4" />
          </button>
          <span className="min-w-8 text-center font-semibold tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            disabled={qty >= max}
            aria-label="Aumentar"
            className={`inline-flex size-11 items-center justify-center rounded-lg text-fg transition-colors hover:bg-white/5 disabled:opacity-40 ${focusRing}`}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAdd}
          className="flex-1"
          aria-live="polite"
        >
          <CartIcon className="size-5" />
          {added ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
        </Button>
      </div>
    </div>
  );
}
