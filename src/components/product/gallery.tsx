"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/cn";
import type { ProductImageRow } from "@/types/database.types";

export function Gallery({
  images,
  productName,
}: {
  images: ProductImageRow[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-surface/60">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id ?? "empty"}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ProductImage
              url={current?.url ?? null}
              alt={productName}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border bg-bg transition-all",
                i === active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-white/10 opacity-70 hover:opacity-100",
              )}
            >
              <ProductImage url={img.url} alt={productName} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
