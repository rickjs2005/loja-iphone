"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Faz o Framer Motion respeitar a preferência de "reduzir movimento" do SO.
 * Usuários com essa opção ligada recebem versões estáticas das animações.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
