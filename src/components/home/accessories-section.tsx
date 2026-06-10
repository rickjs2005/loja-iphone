"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { AccessoryCard } from "@/components/product/accessory-card";
import { ACCESSORY_CATEGORIES, type ProductWithImages } from "@/lib/data/types";
import { cn } from "@/lib/cn";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** "Complete seu ecossistema" — vitrine de acessórios com filtro por categoria. */
export function AccessoriesSection({
  accessories,
}: {
  accessories: ProductWithImages[];
}) {
  const [active, setActive] = useState<string>("todos");

  if (accessories.length === 0) return null;

  // Só mostra abas que têm itens.
  const available = ACCESSORY_CATEGORIES.filter((c) =>
    accessories.some((a) => a.accessory_category === c.value),
  );
  const tabs = [{ value: "todos", label: "Todos" }, ...available];

  const list =
    active === "todos"
      ? accessories
      : accessories.filter((a) => a.accessory_category === active);

  return (
    <section id="acessorios" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Acessórios"
          title="Complete seu ecossistema"
          subtitle="Capas, películas, carregadores e áudio para o seu iPhone."
        />

        {/* Filtro por categoria */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setActive(t.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                active === t.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-white/10 text-muted hover:border-white/25 hover:text-fg",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {list.map((a) => (
            <AccessoryCard key={a.id} product={a} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
