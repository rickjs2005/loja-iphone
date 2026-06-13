"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { MapPinIcon, WhatsappIcon, XIcon } from "@/components/ui/icons";
import { focusRing } from "@/components/ui/button";
import { storeConfig } from "@/config/theme.config";
import { waUrl } from "@/lib/whatsapp";
import { isValidWhatsapp, normalizeWhatsapp } from "@/lib/phone";
import {
  useAttendingUnits,
  useDefaultWhatsapp,
  type AttendingUnit,
} from "@/components/whatsapp/units-context";

/**
 * CTA de WhatsApp ciente das unidades: com 2+ lojas atendendo, pergunta ao
 * cliente em qual ele quer ser atendido (cada unidade tem seu número);
 * com 1 ou nenhuma, abre direto a conversa certa.
 */
export function WhatsappCta({
  message,
  className,
  children,
  ariaLabel,
}: {
  /** Texto pronto da conversa (use os builders de @/lib/whatsapp). */
  message: string;
  /** Estilo do gatilho (ex.: buttonClasses("whatsapp", "md", "w-full")). */
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const units = useAttendingUnits();
  const defaultPhone = useDefaultWhatsapp();
  const [open, setOpen] = useState(false);

  // 0 unidades com número → WhatsApp geral (admin > white-label);
  // 1 → direto nela; 2+ → o cliente escolhe.
  if (units.length < 2) {
    const phone = units[0]?.whatsapp || defaultPhone || storeConfig.whatsapp;
    // Loja recém-criada sem WhatsApp configurado: NUNCA gerar link wa.me sem
    // destinatário (abriria o app numa conversa vazia = conversão perdida em
    // silêncio). Renderiza o gatilho inerte e avisa o dono em dev.
    if (!isValidWhatsapp(normalizeWhatsapp(phone))) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[WhatsappCta] WhatsApp ausente/inválido — defina NEXT_PUBLIC_STORE_WHATSAPP ou o número em Informações da loja (admin).",
        );
      }
      return (
        <span
          className={`${className ?? ""} pointer-events-none opacity-60`}
          aria-disabled="true"
          title="WhatsApp ainda não configurado"
        >
          {children}
        </span>
      );
    }
    return (
      <a
        href={waUrl(phone, message)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <UnitPicker
            units={units}
            message={message}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Modal "em qual loja você quer ser atendido?" */
function UnitPicker({
  units,
  message,
  onClose,
}: {
  units: AttendingUnit[];
  message: string;
  onClose: () => void;
}) {
  // Esc fecha; scroll da página travado enquanto aberto.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Portal no <body>: o CTA pode estar dentro de seções animadas (Reveal/
  // Framer aplica transform), e transform em ancestral faz `position: fixed`
  // ancorar na seção em vez da viewport — o modal renderizava cortado, sem o
  // botão de fechar, com o scroll da página travado (usuário preso na tela).
  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Escolha a loja para te atender"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <m.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong glass-rim w-full max-w-md rounded-t-3xl p-6 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-fg">
              Onde você quer ser atendido?
            </h2>
            <p className="mt-1 text-sm text-muted">
              Cada loja atende pelo próprio WhatsApp.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-fg ${focusRing}`}
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Scroll interno: redes com muitas lojas não estouram a tela. */}
        <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {units.map((unit, i) => (
            <li key={unit.id}>
              <a
                href={waUrl(unit.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                autoFocus={i === 0}
                className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/30 hover:bg-white/[0.06] ${focusRing}`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fg">
                  <MapPinIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-fg">
                    {unit.name}
                  </span>
                  {unit.city && (
                    <span className="block truncate text-sm text-muted">
                      {unit.city}
                    </span>
                  )}
                </span>
                <WhatsappIcon className="size-5 shrink-0 text-whatsapp" />
              </a>
            </li>
          ))}
        </ul>
      </m.div>
    </m.div>,
    document.body,
  );
}
