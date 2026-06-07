"use client";

import { CartIcon } from "@/components/ui/icons";
import { useCartStore, selectTotalItems } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { useHydrated } from "@/lib/cart/use-hydrated";

/** Botão do carrinho no header: abre o drawer e mostra o contador de itens. */
export function CartButton() {
  const total = useCartStore(selectTotalItems);
  const open = useCartUI((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? total : 0;

  return (
    <button
      onClick={open}
      aria-label={`Abrir carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
      className="relative inline-flex size-11 items-center justify-center rounded-xl text-fg transition-colors hover:bg-white/5"
    >
      <CartIcon className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
