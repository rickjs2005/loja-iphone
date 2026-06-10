"use client";

import { Button } from "@/components/ui/button";
import { BagIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { formatCents } from "@/lib/format";

/** Barra fixa de compra no rodapé — só no mobile (experiência de app). */
export function MobilePurchaseBar({
  product,
}: {
  product: Omit<CartItem, "quantity">;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);
  const esgotado = product.stock <= 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-white/10 bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-20 backdrop-blur-xl lg:hidden">
      <div className="leading-tight">
        <p className="text-[11px] text-muted">à vista</p>
        <p className="text-lg font-bold text-fg">
          {formatCents(product.priceCents)}
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => {
          if (esgotado) return;
          addItem(product, 1);
          openCart();
        }}
        disabled={esgotado}
        className="flex-1"
      >
        <BagIcon className="size-5" />
        {esgotado ? "Esgotado" : "Adicionar"}
      </Button>
    </div>
  );
}
