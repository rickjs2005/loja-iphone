"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses, focusRing } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductImage } from "@/components/product/product-image";
import {
  ChevronLeftIcon,
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
import { useHydrated } from "@/lib/cart/use-hydrated";
import { formatCents } from "@/lib/format";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export default function CarrinhoPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const totalCents = useCartStore(selectTotalCents);
  const totalItems = useCartStore(selectTotalItems);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!hydrated) {
    return (
      <Container className="py-12">
        <div className="h-40 animate-pulse rounded-2xl bg-surface/40" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold text-fg">Seu carrinho está vazio</h1>
        <p className="mt-2 text-muted">
          Adicione alguns iPhones e finalize pelo WhatsApp.
        </p>
        <Link href="/" className={buttonClasses("primary", "md", "mt-6")}>
          Ver produtos
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ChevronLeftIcon className="size-4" />
        Continuar comprando
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-fg sm:text-3xl">
        Seu carrinho
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Itens */}
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.li
                key={it.productId}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-4 rounded-2xl border border-white/10 bg-surface/60 p-3"
              >
                <Link
                  href={`/produtos/${it.productId}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-bg"
                >
                  <ProductImage url={it.imageUrl} alt={it.name} sizes="80px" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/produtos/${it.productId}`}
                      className="font-medium leading-snug text-fg hover:text-primary"
                    >
                      {it.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(it.productId)}
                      aria-label={`Remover ${it.name}`}
                      className={`-m-3 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:text-red-400 ${focusRing}`}
                    >
                      <TrashIcon className="size-4" />
                    </button>
                  </div>

                  <p className="text-sm text-muted">
                    {formatCents(it.priceCents)} cada
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-bg/60 px-1">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(it.productId, it.quantity - 1)
                        }
                        disabled={it.quantity <= 1}
                        aria-label="Diminuir"
                        className={`inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-white/5 disabled:opacity-40 ${focusRing}`}
                      >
                        <MinusIcon className="size-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-sm font-semibold tabular-nums">
                        {it.quantity}
                      </span>
                      <button
                        type="button"
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

                    <p className="font-bold text-fg">
                      {formatCents(it.priceCents * it.quantity)}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className={`mt-1 self-start rounded-lg px-2 py-2 text-sm text-muted transition-colors hover:text-red-400 ${focusRing}`}
          >
            Esvaziar carrinho
          </button>
        </ul>

        <ConfirmDialog
          open={confirmClear}
          title="Esvaziar carrinho?"
          description="Todos os itens serão removidos do carrinho. Essa ação não pode ser desfeita."
          confirmLabel="Esvaziar"
          onConfirm={() => {
            clear();
            setConfirmClear(false);
          }}
          onCancel={() => setConfirmClear(false)}
        />

        {/* Resumo */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-surface/60 p-5 lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold text-fg">Resumo</h2>

          <div className="mt-4 flex justify-between text-muted">
            <span>
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </span>
            <span>{formatCents(totalCents)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-medium text-fg">Total</span>
            <span className="text-2xl font-bold text-fg">
              {formatCents(totalCents)}
            </span>
          </div>

          <a
            href={buildWhatsappUrl(items, totalCents)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "lg", "mt-6 w-full")}
          >
            <WhatsappIcon className="size-5" />
            Finalizar no WhatsApp
          </a>

          <p className="mt-3 text-center text-xs text-muted">
            O pagamento e a entrega são combinados diretamente com a loja.
          </p>
        </aside>
      </div>
    </Container>
  );
}
