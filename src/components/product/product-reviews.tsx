import { StarIcon } from "@/components/ui/icons";
import type { TestimonialRow } from "@/types/database.types";

/** Iniciais para o avatar (até 2 letras, das 2 primeiras palavras do nome). */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Avaliações exibidas na página do produto — nota e depoimentos vêm do admin
 * (Conteúdo da loja). Sem nada cadastrado, a seção some (nada fictício).
 */
export function ProductReviews({
  rating,
  reviewCount,
  testimonials,
}: {
  rating: number | null;
  reviewCount: number | null;
  testimonials: TestimonialRow[];
}) {
  if (rating == null && testimonials.length === 0) return null;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl font-bold text-fg">Avaliações</h2>
        {rating != null && (
          <span className="flex items-center gap-1 text-sm text-muted">
            <StarIcon className="size-4 text-amber-400" />
            <strong className="text-fg">
              {Number(rating).toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </strong>
            {reviewCount != null && (
              <> · {reviewCount.toLocaleString("pt-BR")} avaliações</>
            )}
          </span>
        )}
      </div>

      {testimonials.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  {initials(t.name)}
                </span>
                <div>
                  <figcaption className="text-sm font-medium text-fg">
                    {t.name}
                  </figcaption>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="size-3" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="text-sm leading-relaxed text-fg/90">
                “{t.text}”
              </blockquote>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
