"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import type { ProductWithImages } from "@/lib/data/types";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function ProductGrid({ products }: { products: ProductWithImages[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-surface/40 p-12 text-center">
        <p className="text-muted">
          Nenhum produto disponível no momento. Volte em breve!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </motion.div>
  );
}
