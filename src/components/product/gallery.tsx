"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { Lightbox } from "@/components/product/lightbox";
import { IphoneRender } from "@/components/visual/iphone-render";
import { cn } from "@/lib/cn";
import type { ProductImageRow } from "@/types/database.types";

export function Gallery({
  images,
  productName,
  productId,
  accessory = false,
}: {
  images: ProductImageRow[];
  productName: string;
  productId: string;
  accessory?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const current = images[active] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_60%)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id ?? "empty"}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {current ? (
              /* Clique abre o zoom em tela cheia (Lightbox). */
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Ampliar foto"
                className="absolute inset-0 cursor-zoom-in"
              >
                <ProductImage
                  url={current.url}
                  alt={productName}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </button>
            ) : accessory ? (
              <ProductImage url={null} alt={productName} variant="accessory" />
            ) : (
              <div className="flex h-full items-center justify-center p-10">
                <div className="h-full w-auto drop-shadow-[0_24px_50px_rgba(0,0,0,0.55)]">
                  <IphoneRender uid={`detail-${productId}`} colorway="natural" />
                </div>
              </div>
            )}
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

      <AnimatePresence>
        {zoomOpen && (
          <Lightbox
            images={images}
            startIndex={active}
            productName={productName}
            onClose={() => setZoomOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
