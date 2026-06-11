"use client";

import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { formatCents } from "@/lib/format";

/**
 * Barra fixa de compra no rodapé — só no mobile (experiência de app).
 * Um único CTA: adicionar ao carrinho. A compra fecha SEMPRE pelo carrinho
 * ("Finalizar no WhatsApp") — decisão do dono: sem botão de compra direta.
 */
export function MobilePurchaseBar({
  product,
}: {
  product: Omit<CartItem, "quantity">;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);
  const esgotado = product.stock <= 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-white/10 bg-surface/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="leading-tight">
        <p className="text-[11px] text-muted">à vista</p>
        <p className="text-lg font-bold text-fg">
          {formatCents(product.priceCents)}
        </p>
      </div>

      {esgotado ? (
        <Button size="lg" disabled className="flex-1">
          Esgotado
        </Button>
      ) : (
        <Button
          size="lg"
          className="flex-1 whitespace-nowrap text-[15px]"
          onClick={() => {
            addItem(product, 1);
            openCart();
          }}
        >
          <CartIcon className="size-5 shrink-0" />
          Adicionar ao carrinho
        </Button>
      )}
    </div>
  );
}
