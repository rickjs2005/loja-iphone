"use client";

import { buttonClasses } from "@/components/ui/button";

/** Tela de erro inesperado — mantém o visual dark do tema e oferece retry. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Algo deu errado
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Não foi possível carregar a página
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Tente novamente em instantes. Se o problema continuar, fale com a gente
        pelo WhatsApp.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-muted/60">Código: {error.digest}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className={buttonClasses("primary", "lg", "mt-8")}
      >
        Tentar novamente
      </button>
    </div>
  );
}
