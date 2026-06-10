"use client";

import { useEffect } from "react";

/**
 * Banner de sucesso vindo de query param (?criado=1). Ao montar, remove o
 * param da URL pra um F5 (ou compartilhamento do link) não mostrar de novo.
 *
 * Usa history.replaceState (atualização rasa, suportada pelo App Router) em
 * vez de router.replace: este refaria o fetch do Server Component sem o
 * param e desmontaria o banner na hora.
 */
export function SuccessBanner({ message }: { message: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("criado")) {
      url.searchParams.delete("criado");
      window.history.replaceState(null, "", url);
    }
  }, []);

  return (
    <p className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
      {message}
    </p>
  );
}
