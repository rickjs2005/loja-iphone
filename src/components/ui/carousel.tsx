"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { focusRing } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icons";

/**
 * Carrossel horizontal com snap (swipe no mobile, setas no desktop).
 * Acessível: região focável/operável por teclado, dots sincronizados com o
 * scroll e alt numerado por imagem. Sem dependências externas.
 */
export function Carousel({
  images,
  alt = "",
  label,
}: {
  images: { id: string; url: string }[];
  alt?: string;
  /** Nome acessível da região (default: alt ou "Galeria de fotos"). */
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [active, setActive] = useState(0);

  // Índice ativo = slide cujo centro está mais próximo do centro visível.
  // Throttle leve via requestAnimationFrame (scroll dispara em alta frequência).
  function onScroll() {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const c = child as HTMLElement;
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    });
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function goTo(index: number) {
    const el = ref.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  function scroll(dir: 1 | -1) {
    goTo(Math.min(images.length - 1, Math.max(0, active + dir)));
  }

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        tabIndex={0}
        role="region"
        aria-label={label ?? (alt || "Galeria de fotos")}
        className={`flex gap-4 overflow-x-auto scroll-smooth rounded-2xl pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory ${focusRing}`}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-surface sm:w-[55%] lg:w-[42%]"
          >
            <Image
              src={img.url}
              alt={`${alt} ${i + 1} de ${images.length}`.trim()}
              fill
              sizes="(max-width: 768px) 82vw, 42vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className={`absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg sm:flex ${focusRing}`}
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próxima"
            className={`absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg sm:flex ${focusRing}`}
          >
            <ChevronLeftIcon className="size-5 rotate-180" />
          </button>

          {/* Indicadores de posição (sincronizados com o scroll). */}
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir para foto ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={`flex size-6 items-center justify-center rounded-full ${focusRing}`}
              >
                <span
                  className={`size-2 rounded-full transition-colors ${
                    i === active ? "bg-fg" : "bg-muted/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
