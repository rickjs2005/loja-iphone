"use client";

import { Button, buttonClasses, focusRing } from "@/components/ui/button";
import { CartIcon, WhatsappIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { formatCents } from "@/lib/format";
import { buildBuyNowUrl } from "@/lib/whatsapp";

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

      {esgotado ? (
        <Button size="lg" disabled className="flex-1">
          Esgotado
        </Button>
      ) : (
        <>
          {/* Secundário: adiciona ao carrinho sem sair da página. */}
          <button
            type="button"
            onClick={() => {
              addItem(product, 1);
              openCart();
            }}
            aria-label="Adicionar ao carrinho"
            className={`inline-flex size-13 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-surface/60 text-fg transition-colors hover:bg-surface ${focusRing}`}
          >
            <CartIcon className="size-5" />
          </button>

          {/* Primário: compra direto no WhatsApp. */}
          <a
            href={buildBuyNowUrl({
              id: product.productId,
              name: product.name,
              priceCents: product.priceCents,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "lg", "flex-1")}
          >
            <WhatsappIcon className="size-5" />
            Comprar
          </a>
        </>
      )}
    </div>
  );
}
