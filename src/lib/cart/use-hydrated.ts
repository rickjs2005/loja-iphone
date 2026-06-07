"use client";

import { useEffect, useState } from "react";

/**
 * Evita mismatch de hidratação: o carrinho vem do localStorage (só existe no
 * client). Componentes que mostram dados do carrinho usam isto para renderizar
 * o estado real apenas após a montagem.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Guard de hidratação: roda uma única vez após a montagem para sinalizar
    // que já estamos no client (onde o localStorage do carrinho existe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}
