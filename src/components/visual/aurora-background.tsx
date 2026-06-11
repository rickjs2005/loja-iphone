"use client";

import { m } from "framer-motion";

/**
 * Fundo "vivo" do dark luxury: luzes discretas (uma com a cor da marca, bem
 * diluída, e uma branca neutra) deslizando sobre o preto profundo. Fixo,
 * atrás de tudo, sem capturar cliques.
 */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Mobile: as mesmas luzes, ESTÁTICAS — animação infinita com blur de
          160px drena bateria e rouba FPS em celular; o visual fica igual. */}
      <div className="absolute -top-48 left-1/4 size-[760px] rounded-full bg-primary/10 blur-[160px] lg:hidden" />
      <div className="absolute top-1/4 right-0 size-[620px] rounded-full bg-white/[0.05] blur-[160px] lg:hidden" />
      <m.div
        className="absolute -top-48 left-1/4 size-[760px] rounded-full bg-primary/10 blur-[160px] max-lg:hidden"
        animate={{ x: [0, 80, -30, 0], y: [0, 50, 10, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        className="absolute top-1/4 right-0 size-[620px] rounded-full bg-white/[0.05] blur-[160px] max-lg:hidden"
        animate={{ x: [0, -60, 20, 0], y: [0, 70, -10, 0], scale: [1, 1.1, 1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Grade tecnológica sutil */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
      {/* Vinheta sutil para focar o conteúdo no centro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
