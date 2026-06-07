"use client";

import { motion } from "framer-motion";

/**
 * Fundo "vivo": orbes de luz em degradê que se movem lentamente, dando
 * profundidade tecnológica sobre o preto absoluto. Fixo, atrás de tudo,
 * sem capturar cliques.
 */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <motion.div
        className="absolute -top-40 left-1/4 size-[520px] rounded-full bg-primary/20 blur-[140px]"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-0 size-[440px] rounded-full bg-accent/20 blur-[140px]"
        animate={{ x: [0, -50, 20, 0], y: [0, 60, -10, 0], scale: [1, 1.1, 1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-[#FF2D55]/12 blur-[150px]"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Vinheta sutil para focar o conteúdo no centro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
