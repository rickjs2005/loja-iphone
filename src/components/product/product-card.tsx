"use client";

import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { StockBadge } from "@/components/product/stock-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ShieldIcon } from "@/components/ui/icons";
import { IphoneRender, colorwayByIndex } from "@/components/visual/iphone-render";
import { formatCents, formatInstallments } from "@/lib/format";
import {
  coverImage,
  conditionLabel,
  type ProductWithImages,
} from "@/lib/data/types";

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.92, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductWithImages;
  index?: number;
}) {
  const cover = coverImage(product);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(110,92,246,0.18), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <motion.article
      variants={item}
      onMouseMove={onMove}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors duration-300 hover:border-primary/50 hover:shadow-[0_24px_60px_-20px_rgba(10,132,255,0.45)]"
    >
      {/* Spotlight que segue o cursor */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Brilho percorrendo o card no hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <Link href={`/produtos/${product.id}`} className="relative block">
        <div className="relative aspect-[4/5] overflow-hidden">
          {/* Glow de fundo combinando com o gradiente do logo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(110,92,246,0.18),transparent_60%)]" />

          {cover ? (
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
              <ProductImage url={cover.url} alt={product.name} />
            </div>
          ) : product.category === "accessory" ? (
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
              <ProductImage url={null} alt={product.name} variant="accessory" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.06] group-hover:-rotate-1">
              <div className="h-full w-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]">
                <IphoneRender
                  uid={product.id}
                  colorway={colorwayByIndex(index)}
                />
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 z-20">
            <StockBadge stock={product.stock} />
          </div>
          {conditionLabel(product.condition) && (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-zinc-100 backdrop-blur">
              {conditionLabel(product.condition)}
            </div>
          )}
        </div>
      </Link>

      <div className="relative z-20 flex flex-1 flex-col gap-3 p-5">
        <Link href={`/produtos/${product.id}`} className="flex-1">
          <h3 className="text-lg font-semibold leading-snug text-fg transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {product.description}
            </p>
          )}
        </Link>

        <div>
          <p className="text-3xl font-extrabold tracking-tight text-fg">
            {formatCents(product.price_cents)}
          </p>
          <p className="text-sm text-muted">
            ou {formatInstallments(product.price_cents, product.installments)}{" "}
            sem juros
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted">
          <ShieldIcon className="size-3.5 text-emerald-400" />
          Garantia inclusa
          {product.battery_health ? ` · Bateria ${product.battery_health}%` : ""}
        </div>

        <AddToCartButton
          size="md"
          fullWidth
          product={{
            productId: product.id,
            name: product.name,
            priceCents: product.price_cents,
            imageUrl: cover?.url ?? null,
            stock: product.stock,
            category: product.category === "accessory" ? "accessory" : "iphone",
          }}
        />
      </div>
    </motion.article>
  );
}
