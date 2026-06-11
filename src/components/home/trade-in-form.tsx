"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { buttonClasses, focusRing } from "@/components/ui/button";
import { WhatsappIcon, XIcon } from "@/components/ui/icons";
import { WhatsappCta } from "@/components/whatsapp/whatsapp-cta";
import { tradeInMessage } from "@/lib/whatsapp";

const inputClasses =
  "h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-fg " +
  "placeholder:text-muted/60 focus:border-white/40 focus:outline-none";

/**
 * Formulário do trade-in: o cliente informa modelo e saúde da bateria ANTES
 * de abrir o WhatsApp — a mensagem chega pronta e o atendimento já começa
 * com o que importa. As fotos vão na conversa (wa.me não carrega anexo).
 */
export function TradeInForm({ onClose }: { onClose: () => void }) {
  const [model, setModel] = useState("");
  const [battery, setBattery] = useState("");
  const canSend = model.trim().length >= 3;

  // Esc fecha; scroll da página travado enquanto aberto (mesmo padrão do
  // seletor de unidades).
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

  // Portal no <body>: a seção usa animações com transform, que quebrariam o
  // position:fixed deste modal (mesmo motivo do seletor de unidades).
  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Avaliar meu iPhone"
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
        className="w-full max-w-md rounded-t-3xl border border-white/10 bg-surface p-6 sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-fg">
              Avalie seu iPhone
            </h2>
            <p className="mt-1 text-sm text-muted">
              Preencha e o WhatsApp abre com tudo pronto — é só enviar.
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

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="tradein-model"
              className="mb-1.5 block text-sm font-medium text-fg"
            >
              Modelo do seu iPhone
            </label>
            <input
              id="tradein-model"
              type="text"
              autoFocus
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex.: iPhone 13 128GB"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="tradein-battery"
              className="mb-1.5 block text-sm font-medium text-fg"
            >
              Saúde da bateria (%){" "}
              <span className="font-normal text-muted">— opcional</span>
            </label>
            <input
              id="tradein-battery"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={battery}
              onChange={(e) => setBattery(e.target.value)}
              placeholder="Ex.: 87"
              className={inputClasses}
            />
            <p className="mt-1.5 text-xs text-muted">
              Veja em Ajustes → Bateria → Saúde da bateria.
            </p>
          </div>

          <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-muted">
            📸 As fotos do aparelho você manda direto na conversa — o
            WhatsApp já abre com seus dados preenchidos.
          </p>

          {canSend ? (
            <WhatsappCta
              message={tradeInMessage({ model, battery })}
              className={buttonClasses("whatsapp", "lg", "w-full")}
            >
              <WhatsappIcon className="size-5" />
              Enviar para avaliação
            </WhatsappCta>
          ) : (
            <button
              type="button"
              disabled
              className={buttonClasses("whatsapp", "lg", "w-full opacity-50")}
            >
              <WhatsappIcon className="size-5" />
              Enviar para avaliação
            </button>
          )}
        </div>
      </m.div>
    </m.div>,
    document.body,
  );
}
