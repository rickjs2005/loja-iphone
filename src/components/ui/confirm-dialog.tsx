"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "framer-motion";
import { focusRing } from "@/components/ui/button";

/** Modal de confirmação limpo (estilo terminal) para ações destrutivas. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC fecha; foco vai pro painel ao abrir e volta a quem abriu ao fechar.
  useEffect(() => {
    if (!open) return;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => !loading && onCancel()}
        >
          <m.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            ref={panelRef}
            tabIndex={-1}
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 outline-none"
          >
            <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-zinc-400">{description}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={`rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50 ${focusRing}`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60 ${focusRing}`}
              >
                {loading ? "Excluindo..." : confirmLabel}
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
