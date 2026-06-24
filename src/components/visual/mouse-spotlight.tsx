"use client";

import { useEffect } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/**
 * Glow sutil que acompanha o cursor por toda a página (sensação premium).
 * Fixo, atrás do conteúdo, sem capturar cliques. Desativado no toque (sem mouse).
 */
export function MouseSpotlight() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  const bg = useMotionTemplate`radial-gradient(600px circle at ${sx}px ${sy}px, rgba(255,255,255,0.06), rgba(255,255,255,0.025) 40%, transparent 70%)`;

  useEffect(() => {
    // O glow só aparece em lg+ (hidden lg:block). Sem este guard, o listener
    // dispararia a cada toque no celular, gastando CPU/bateria à toa.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <m.div
      aria-hidden
      style={{ background: bg }}
      className="pointer-events-none fixed inset-0 -z-[5] hidden lg:block"
    />
  );
}
