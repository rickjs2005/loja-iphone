"use client";

import Link from "next/link";
import { CartIcon } from "@/components/ui/icons";
import { useCartStore, selectTotalItems } from "@/lib/cart/store";
import { useHydrated } from "@/lib/cart/use-hydrated";

/** Botão do carrinho no header, com contador animado de itens. */
export function CartButton() {
  const total = useCartStore(selectTotalItems);
  const hydrated = useHydrated();
  const count = hydrated ? total : 0;

  return (
    <Link
      href="/carrinho"
      aria-label={`Carrinho com ${count} ${count === 1 ? "item" : "itens"}`}
      className="relative inline-flex size-11 items-center justify-center rounded-xl text-fg transition-colors hover:bg-white/5"
    >
      <CartIcon className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
