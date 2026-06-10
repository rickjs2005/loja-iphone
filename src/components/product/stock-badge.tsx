import { cn } from "@/lib/cn";

/**
 * Badge de disponibilidade: verde com estoque, âmbar nas últimas unidades
 * (escassez honesta — só quando o estoque é 3 ou menos) e vermelho esgotado.
 */
export function StockBadge({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  const esgotado = stock <= 0;
  const ultimas = !esgotado && stock <= 3;

  const label = esgotado
    ? "Esgotado"
    : ultimas
      ? stock === 1
        ? "Última unidade"
        : `Últimas ${stock}`
      : "Em estoque";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
        esgotado
          ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
          : ultimas
            ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
            : "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          esgotado ? "bg-red-400" : ultimas ? "bg-amber-400" : "bg-emerald-400",
        )}
      />
      {label}
    </span>
  );
}
