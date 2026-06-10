"use client";

/**
 * Rede de segurança do admin: captura erros não tratados (ex.: actions void
 * que falham no banco/storage) e troca a tela genérica do Next por uma
 * mensagem em português com opção de tentar de novo.
 */
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-zinc-100">Algo deu errado</h2>
      <p className="text-sm text-zinc-400">
        Não foi possível concluir a operação. Pode ser uma instabilidade
        momentânea — tente de novo.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        Tentar de novo
      </button>
    </div>
  );
}
