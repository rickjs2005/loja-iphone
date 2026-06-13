import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Título de seção padronizado — garante a MESMA tipografia, espaçamento e
 * alinhamento em toda a loja (consistência de acabamento).
 *
 * Duas vozes: "center" (institucional, título grande) e "left" (listagens de
 * catálogo no padrão editorial — uppercase com link de ação à direita).
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "center",
  className,
}: {
  /** Rótulo curto acima do título (uppercase, tracking largo). */
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Link/botão exibido à direita (apenas no align="left"). */
  action?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  if (align === "left") {
    return (
      <div
        className={cn(
          "mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mb-10",
          className,
        )}
      >
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {eyebrow}
            </p>
          )}
          {/* Sentence case: consistente com o hero (o uppercase ficou só no
              eyebrow — hierarquia calma, padrão Apple). */}
          <h2 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 pb-1">{action}</div>}
      </div>
    );
  }

  return (
    <div className={cn("mb-10 text-center sm:mb-12", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-bold tracking-[-0.03em] text-fg sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
