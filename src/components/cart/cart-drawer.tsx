"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { buttonClasses } from "@/components/ui/button";
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
} from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";
import { useHydrated } from "@/lib/cart/use-hydrated";
import { formatCents } from "@/lib/format";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const isOpen = useCartUI((s) => s.isOpen);
  const close = useCartUI((s) => s.close);
  const items = useCartStore((s) => s.items);
  const totalCents = useCartStore(selectTotalCents);
  const totalItems = useCartStore(selectTotalItems);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const hydrated = useHydrated();

  // Fecha com ESC e trava o scroll do body quando aberto.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const empty = !hydrated || items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-surface/95 backdrop-blur-xl"
            role="dialog"
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
                className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-fg"
              >
                ✕
              </button>
            </div>

            {empty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-muted">Seu carrinho está vazio.</p>
                <button onClick={close} className={buttonClasses("primary")}>
                  Ver produtos
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto p-5">
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
                            className="text-muted transition-colors hover:text-red-400"
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
                              className="inline-flex size-7 items-center justify-center rounded-md text-fg hover:bg-white/5 disabled:opacity-40"
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
                              className="inline-flex size-7 items-center justify-center rounded-md text-fg hover:bg-white/5 disabled:opacity-40"
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

                <div className="space-y-3 border-t border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Total</span>
                    <span className="text-2xl font-bold text-fg">
                      {formatCents(totalCents)}
                    </span>
                  </div>
                  <a
                    href={buildWhatsappUrl(items, totalCents)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("whatsapp", "lg", "w-full")}
                  >
                    <WhatsappIcon className="size-5" />
                    Finalizar no WhatsApp
                  </a>
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
