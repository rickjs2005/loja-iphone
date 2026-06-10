"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeftIcon, XIcon } from "@/components/ui/icons";
import { focusRing } from "@/components/ui/button";
import type { ProductImageRow } from "@/types/database.types";

/**
 * Visualização em tela cheia das fotos do produto, com zoom.
 * Clique/toque na foto alterna o zoom (2.5x no ponto clicado); setas ou
 * teclado (← →) trocam de foto; Esc ou o fundo fecham.
 */
export function Lightbox({
  images,
  startIndex,
  productName,
  onClose,
}: {
  images: ProductImageRow[];
  startIndex: number;
  productName: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const current = images[index];

  // Trava o scroll da página enquanto o lightbox está aberto.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, onClose]);

  function step(dir: 1 | -1) {
    setZoom(false);
    setIndex((i) => (i + dir + images.length) % images.length);
  }

  function toggleZoom(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(
      `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`,
    );
    setZoom((z) => !z);
  }

  if (!current) return null;

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos de ${productName}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className={`absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 ${focusRing}`}
      >
        <XIcon className="size-5" />
      </button>

      {images.length > 1 && (
        <p className="absolute top-6 left-1/2 z-10 -translate-x-1/2 text-sm tabular-nums text-white/60">
          {index + 1} / {images.length}
        </p>
      )}

      {/* Foto — clique alterna o zoom no ponto clicado */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleZoom(e);
        }}
        aria-label={zoom ? "Reduzir" : "Ampliar"}
        className={`relative h-[86vh] w-[94vw] overflow-hidden outline-none ${
          zoom ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{
              transform: zoom ? "scale(2.5)" : "scale(1)",
              transformOrigin: origin,
            }}
          >
            <Image
              src={current.url}
              alt={`${productName} — foto ${index + 1}`}
              fill
              sizes="94vw"
              className="object-contain"
              priority
            />
          </m.div>
        </AnimatePresence>
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Foto anterior"
            className={`absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 ${focusRing}`}
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Próxima foto"
            className={`absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/15 ${focusRing}`}
          >
            <ChevronLeftIcon className="size-5 rotate-180" />
          </button>
        </>
      )}
    </m.div>
  );
}
