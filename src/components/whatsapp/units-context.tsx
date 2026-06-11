"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Unidade que ATENDE pelo WhatsApp (só as que têm número próprio). */
export type AttendingUnit = {
  id: string;
  name: string;
  city: string | null;
  whatsapp: string;
};

type WhatsappContextValue = {
  units: AttendingUnit[];
  /** Número geral da loja (admin > white-label) — fallback dos CTAs. */
  defaultPhone: string;
};

const UnitsContext = createContext<WhatsappContextValue>({
  units: [],
  defaultPhone: "",
});

/**
 * Disponibiliza as unidades atendentes e o número geral para os CTAs de
 * WhatsApp da loja. Com 2+ unidades, o <WhatsappCta> pergunta ao cliente
 * em qual loja ele quer ser atendido antes de abrir a conversa.
 */
export function UnitsProvider({
  units,
  defaultPhone,
  children,
}: {
  units: AttendingUnit[];
  defaultPhone: string;
  children: ReactNode;
}) {
  return (
    <UnitsContext.Provider value={{ units, defaultPhone }}>
      {children}
    </UnitsContext.Provider>
  );
}

export function useAttendingUnits(): AttendingUnit[] {
  return useContext(UnitsContext).units;
}

export function useDefaultWhatsapp(): string {
  return useContext(UnitsContext).defaultPhone;
}
