"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import { ActiveToggle } from "@/components/admin/active-toggle";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { TrashIcon } from "@/components/ui/icons";
import {
  CATEGORIES,
  categoryLabel,
  coverImage,
  type ProductCategory,
  type ProductWithImages,
} from "@/lib/data/types";
import { formatCents } from "@/lib/format";
import { cn } from "@/lib/cn";

type Tab = "todos" | ProductCategory;

export function ProductList({
  products,
  deleteAction,
}: {
  products: ProductWithImages[];
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [tab, setTab] = useState<Tab>("todos");

  const list =
    tab === "todos" ? products : products.filter((p) => p.category === tab);

  // "Todos" + uma aba por linha que tem produto cadastrado.
  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: products.length },
    ...CATEGORIES.map((c) => ({
      key: c.value as Tab,
      label: c.plural,
      count: products.filter((p) => p.category === c.value).length,
    })).filter((t) => t.count > 0),
  ];

  return (
    <div>
      {/* Abas */}
      <div className="mb-4 inline-flex flex-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100",
            )}
          >
            {t.label}{" "}
            <span className="font-mono text-xs text-zinc-500">{t.count}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center text-zinc-500">
          Nenhum produto cadastrado
          {tab === "todos" ? "" : ` em ${categoryLabel(tab)}`}.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <ul className="divide-y divide-zinc-800">
            {list.map((product) => {
              const cover = coverImage(product);
              const acc = product.category === "accessory";
              return (
                <li
                  key={product.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 transition-colors hover:bg-zinc-800/40 sm:p-4"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                    <ProductImage
                      url={cover?.url ?? null}
                      alt={product.name}
                      sizes="48px"
                      variant={acc ? "accessory" : "iphone"}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-zinc-100">
                        {product.name}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
                          acc
                            ? "bg-primary/15 text-primary"
                            : "bg-zinc-800 text-zinc-400",
                        )}
                      >
                        {categoryLabel(product.category)}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold text-zinc-100">
                        {formatCents(product.price_cents)}
                      </span>
                      <span className="text-zinc-500">
                        {" "}
                        ·{" "}
                        <span className="font-mono tabular-nums">
                          {product.stock}
                        </span>{" "}
                        em estoque
                      </span>
                    </p>
                  </div>

                  <ActiveToggle id={product.id} active={product.is_active} />

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      Editar
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteAction}
                      fields={{ id: product.id }}
                      title="Excluir produto?"
                      description={`"${product.name}" e suas fotos serão removidos. Esta ação não pode ser desfeita.`}
                      triggerLabel={`Excluir ${product.name}`}
                      triggerClassName="inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <TrashIcon className="size-4" />
                    </ConfirmDeleteButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
