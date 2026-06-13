"use client";

import Link from "next/link";
import { m, useMotionTemplate, useMotionValue } from "framer-motion";
import { ProductImage } from "@/components/product/product-image";
import { StockBadge } from "@/components/product/stock-badge";
import { buttonClasses } from "@/components/ui/button";
import { IphoneRender, colorwayByIndex } from "@/components/visual/iphone-render";
import { formatCents, formatInstallments } from "@/lib/format";
import {
  coverImage,
  conditionLabel,
  isNew,
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
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(255,255,255,0.08), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  return (
    <m.article
      variants={item}
      onMouseMove={onMove}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group glass glass-rim glass-spec relative flex flex-col overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-[0_34px_80px_-22px_rgba(0,0,0,0.9)]"
    >
      {/* Spotlight que segue o cursor */}
      <m.div
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
          {/* Luz de vitrine atrás do aparelho */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_60%)]" />

          {cover ? (
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
              <ProductImage url={cover.url} alt={product.name} />
            </div>
          ) : product.category !== "iphone" ? (
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
          {/* Canto inferior: não disputa espaço com o badge de estoque no
              grid mobile de 2 colunas. */}
          {isNew(product) ? (
            /* Lacrado: badge monocromático, destaque máximo sem cor extra. */
            <div className="absolute bottom-3 right-3 z-20 rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-black">
              Novo
            </div>
          ) : (
            conditionLabel(product.condition) && (
              <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-zinc-100 backdrop-blur">
                {conditionLabel(product.condition)}
              </div>
            )
          )}
        </div>
      </Link>

      <div className="relative z-20 flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-5">
        {/* Card enxuto (escaneabilidade): nome, preço e parcela. Descrição,
            garantia e bateria moram na página do produto — aqui só atrasam
            a leitura do grid. */}
        <Link href={`/produtos/${product.id}`} className="flex-1">
          <h3 className="text-base font-semibold leading-snug text-fg transition-colors group-hover:text-primary sm:text-lg">
            {product.name}
          </h3>
        </Link>

        <div>
          <p className="text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            {formatCents(product.price_cents)}
          </p>
          <p className="text-xs text-muted sm:text-sm">
            ou {formatInstallments(product.price_cents, product.installments)}{" "}
            sem juros
          </p>
        </div>

        {/* CTA: abre a página do produto — a compra fecha pelo carrinho. */}
        {product.stock > 0 ? (
          <Link
            href={`/produtos/${product.id}`}
            className={buttonClasses("primary", "md", "w-full")}
          >
            Ver produto
          </Link>
        ) : (
          <span
            className={buttonClasses(
              "outline",
              "md",
              "w-full opacity-50 pointer-events-none",
            )}
          >
            Esgotado
          </span>
        )}
      </div>
    </m.article>
  );
}
