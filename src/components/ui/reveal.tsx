"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Scroll reveal: o conteúdo surge suavemente (fade + sobe) quando entra na
 * viewport. Sem animação de blur — animar `filter` força repaint e causa
 * jank em mobile mais fraco.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
