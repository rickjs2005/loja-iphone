"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Unidade que ATENDE pelo WhatsApp (só as que têm número próprio). */
export type AttendingUnit = {
  id: string;
  name: string;
  city: string | null;
  whatsapp: string;
};

const UnitsContext = createContext<AttendingUnit[]>([]);

/**
 * Disponibiliza as unidades atendentes para os CTAs de WhatsApp da loja.
 * Com 2+ unidades, o <WhatsappCta> pergunta ao cliente em qual loja ele
 * quer ser atendido antes de abrir a conversa.
 */
export function UnitsProvider({
  units,
  children,
}: {
  units: AttendingUnit[];
  children: ReactNode;
}) {
  return <UnitsContext.Provider value={units}>{children}</UnitsContext.Provider>;
}

export function useAttendingUnits(): AttendingUnit[] {
  return useContext(UnitsContext);
}
