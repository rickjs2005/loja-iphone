"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { buttonClasses, focusRing } from "@/components/ui/button";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  WhatsappIcon,
} from "@/components/ui/icons";
import {
  useCartStore,
  selectTotalCents,
  selectTotalItems,
  selectHasDevice,
  type CartItem,
} from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { useCartSync } from "@/components/cart/use-cart-sync";
import { useHydrated } from "@/lib/cart/use-hydrated";
import { formatCents } from "@/lib/format";
import { WhatsappCta } from "@/components/whatsapp/whatsapp-cta";
import { cartMessage } from "@/lib/whatsapp";

export function CartDrawer({
  accessories = [],
}: {
  accessories?: Omit<CartItem, "quantity">[];
}) {
  const isOpen = useCartUI((s) => s.isOpen);
  const close = useCartUI((s) => s.close);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const totalCents = useCartStore(selectTotalCents);
  const totalItems = useCartStore(selectTotalItems);
  const hasDevice = useCartStore(selectHasDevice);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const hydrated = useHydrated();
  const panelRef = useRef<HTMLElement>(null);
  // Revalida preço/estoque no servidor sempre que o drawer abre (com debounce).
  const syncNotice = useCartSync(isOpen);

  // Upsell: acessórios ainda não adicionados (até 3), só se há iPhone no carrinho.
  const upsell = accessories
    .filter((a) => !items.some((i) => i.productId === a.productId))
    .slice(0, 3);

  // Fecha com ESC, trava o scroll do body e gerencia o foco (move pro painel
  // ao abrir, devolve a quem abriu ao fechar).
  useEffect(() => {
    if (!isOpen) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [isOpen, close]);

  const empty = !hydrated || items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 touch-none bg-black/60 backdrop-blur-sm"
          />

          <m.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            ref={panelRef}
            tabIndex={-1}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overscroll-contain border-l border-white/10 bg-surface/95 outline-none backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold text-fg">
                Seu carrinho{" "}
                {!empty && (
                  <span className="text-muted">({totalItems})</span>
                )}
              </h2>
              <button
                onClick={close}
                aria-label="Fechar"
                className={`inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-fg ${focusRing}`}
              >
                ✕
              </button>
            </div>

            {empty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-muted">Seu carrinho está vazio.</p>
                {/* A sync pode ter removido itens esgotados/desativados. */}
                {syncNotice && (
                  <p className="text-xs text-muted">
                    Preços e estoque atualizados agora.
                  </p>
                )}
                <button onClick={close} className={buttonClasses("primary")}>
                  Ver produtos
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-5">
                  {items.map((it) => (
                    <li
                      key={it.productId}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-bg/40 p-3"
                    >
                      <Link
                        href={`/produtos/${it.productId}`}
                        onClick={close}
                        className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-bg"
                      >
                        <ProductImage url={it.imageUrl} alt={it.name} sizes="64px" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/produtos/${it.productId}`}
                            onClick={close}
                            className="text-sm font-medium leading-snug text-fg hover:text-primary"
                          >
                            {it.name}
                          </Link>
                          <button
                            onClick={() => removeItem(it.productId)}
                            aria-label={`Remover ${it.name}`}
                            className={`-m-3 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-red-400 ${focusRing}`}
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 rounded-lg border border-white/15 px-1">
                            <button
                              onClick={() =>
                                setQuantity(it.productId, it.quantity - 1)
                              }
                              disabled={it.quantity <= 1}
                              aria-label="Diminuir"
                              className={`inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-white/5 disabled:opacity-40 ${focusRing}`}
                            >
                              <MinusIcon className="size-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold tabular-nums">
                              {it.quantity}
                            </span>
                            <button
                              onClick={() =>
                                setQuantity(it.productId, it.quantity + 1)
                              }
                              disabled={it.quantity >= it.stock}
                              aria-label="Aumentar"
                              className={`inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-white/5 disabled:opacity-40 ${focusRing}`}
                            >
                              <PlusIcon className="size-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-fg">
                            {formatCents(it.priceCents * it.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {hasDevice && upsell.length > 0 && (
                  <div className="border-t border-white/10 p-5">
                    <p className="mb-3 text-sm font-semibold text-fg">
                      Leve alguns acessórios também 🎁
                    </p>
                    <div className="space-y-2">
                      {upsell.map((a) => (
                        <div
                          key={a.productId}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg/40 p-2"
                        >
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-bg">
                            <ProductImage
                              url={a.imageUrl}
                              alt={a.name}
                              variant="accessory"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-fg">{a.name}</p>
                            <p className="text-sm font-semibold text-fg">
                              {formatCents(a.priceCents)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(a, 1)}
                            disabled={a.stock <= 0}
                            className={`shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 ${focusRing}`}
                          >
                            + Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-white/10 p-5">
                  {syncNotice && (
                    <p className="text-xs text-muted">
                      Preços e estoque atualizados agora.
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total</span>
                    <span className="text-2xl font-bold text-fg">
                      {formatCents(totalCents)}
                    </span>
                  </div>
                  <WhatsappCta
                    message={cartMessage(items, totalCents)}
                    className={buttonClasses("whatsapp", "lg", "w-full")}
                  >
                    <WhatsappIcon className="size-5" />
                    Finalizar no WhatsApp
                  </WhatsappCta>
                  <Link
                    href="/carrinho"
                    onClick={close}
                    className="block text-center text-sm text-muted transition-colors hover:text-fg"
                  >
                    Ver carrinho completo
                  </Link>
                </div>
              </>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
