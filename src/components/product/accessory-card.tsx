"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatCents } from "@/lib/format";
import { coverImage, type ProductWithImages } from "@/lib/data/types";

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Card compacto de acessório (grid de 4–5 colunas). */
export function AccessoryCard({ product }: { product: ProductWithImages }) {
  const cover = coverImage(product);

  return (
    <m.article
      variants={item}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur transition-colors hover:border-white/30"
    >
      <Link
        href={`/produtos/${product.id}`}
        className="relative mb-3 block aspect-square overflow-hidden rounded-xl bg-bg"
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <ProductImage
            url={cover?.url ?? null}
            alt={product.name}
            variant="accessory"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        {product.stock <= 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-zinc-200">
            Esgotado
          </span>
        )}
      </Link>

      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-fg">
        {product.name}
      </h3>
      <p className="mt-1 mb-3 text-lg font-bold text-fg">
        {formatCents(product.price_cents)}
      </p>

      <div className="mt-auto">
        <AddToCartButton
          size="sm"
          fullWidth
          product={{
            productId: product.id,
            name: product.name,
            priceCents: product.price_cents,
            imageUrl: cover?.url ?? null,
            stock: product.stock,
            category: "accessory",
          }}
        />
      </div>
    </m.article>
  );
}
