"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Faz o Framer Motion respeitar a preferência de "reduzir movimento" do SO.
 * Usuários com essa opção ligada recebem versões estáticas das animações.
 *
 * LazyMotion + `strict` reduz o bundle: só o subconjunto `domAnimation` é
 * incluído e os componentes usam `m.*` em vez de `motion.*` (que lançaria
 * erro em runtime por causa do modo estrito).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
