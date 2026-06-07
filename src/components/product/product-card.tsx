"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { StockBadge } from "@/components/product/stock-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatCents } from "@/lib/format";
import { coverImage, type ProductWithImages } from "@/lib/data/types";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProductCard({ product }: { product: ProductWithImages }) {
  const cover = coverImage(product);

  return (
    <motion.article
      variants={item}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface/60 backdrop-blur"
    >
      <Link href={`/produtos/${product.id}`} className="relative block">
        <div className="relative aspect-square overflow-hidden bg-bg">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <ProductImage url={cover?.url ?? null} alt={product.name} />
          </div>
          <div className="absolute left-3 top-3">
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <Link href={`/produtos/${product.id}`}>
            <h3 className="font-semibold leading-snug text-fg transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <p className="text-xl font-bold text-fg">
            {formatCents(product.price_cents)}
          </p>
        </div>

        <AddToCartButton
          size="sm"
          fullWidth
          product={{
            productId: product.id,
            name: product.name,
            priceCents: product.price_cents,
            imageUrl: cover?.url ?? null,
            stock: product.stock,
          }}
        />
      </div>
    </motion.article>
  );
}
