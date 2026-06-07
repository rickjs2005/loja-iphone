"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeftIcon } from "@/components/ui/icons";

/**
 * Carrossel horizontal com snap (swipe no mobile, setas no desktop).
 * Sem dependências externas.
 */
export function Carousel({
  images,
  alt = "",
}: {
  images: { id: string; url: string }[];
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-surface sm:w-[55%] lg:w-[42%]"
          >
            <Image
              src={img.url}
              alt={alt}
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
            className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg sm:flex"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próxima"
            className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-bg/70 text-fg backdrop-blur transition-colors hover:bg-bg sm:flex"
          >
            <ChevronLeftIcon className="size-5 rotate-180" />
          </button>
        </>
      )}
    </div>
  );
}
