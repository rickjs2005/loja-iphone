"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Número que conta de 0 até o valor quando entra na viewport.
 * Ex.: <CountUp value={3000} prefix="+" /> → "+3.000"
 *
 * A animação escreve direto em textContent (sem setState): evita ~100
 * re-renders do React por contador. O "0" inicial é renderizado no SSR.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;

    const format = (v: number) =>
      `${prefix}${v.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    // prefers-reduced-motion: mostra o valor final direto, sem animar.
    if (reducedMotion) {
      node.textContent = format(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, decimals, reducedMotion]);

  const initial = (0).toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {initial}
      {suffix}
    </span>
  );
}
