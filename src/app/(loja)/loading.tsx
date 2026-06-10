/** Loading genérico das rotas da loja: spinner discreto no tema. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
    </div>
  );
}
