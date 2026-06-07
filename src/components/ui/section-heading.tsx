import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Título de seção padronizado — garante a MESMA tipografia, espaçamento e
 * alinhamento em toda a loja (consistência de acabamento).
 */
export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 text-center sm:mb-12", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
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
