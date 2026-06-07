import { cn } from "@/lib/cn";

/** Badge de disponibilidade: verde quando há estoque, vermelho quando esgotado. */
export function StockBadge({
  stock,
  className,
}: {
  stock: number;
  className?: string;
}) {
  const disponivel = stock > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur",
        disponivel
          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          disponivel ? "bg-emerald-400" : "bg-red-400",
        )}
      />
      {disponivel ? "Disponível" : "Esgotado"}
    </span>
  );
}
