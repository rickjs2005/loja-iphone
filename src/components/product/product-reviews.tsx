import { StarIcon } from "@/components/ui/icons";

const REVIEWS = [
  {
    name: "Carlos M.",
    initials: "CM",
    text: "Aparelho impecável, exatamente como descrito. Bateria em 100%. Recomendo!",
  },
  {
    name: "Beatriz L.",
    initials: "BL",
    text: "Chegou rápido e bem embalado. Atendimento no WhatsApp foi super atencioso.",
  },
];

/** Avaliações exibidas na página do produto. */
export function ProductReviews() {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl font-bold text-fg">Avaliações</h2>
        <span className="flex items-center gap-1 text-sm text-muted">
          <StarIcon className="size-4 text-amber-400" />
          <strong className="text-fg">4,9</strong> · 312 avaliações
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                {r.initials}
              </span>
              <div>
                <figcaption className="text-sm font-medium text-fg">
                  {r.name}
                </figcaption>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-3" />
                  ))}
                </div>
              </div>
            </div>
            <blockquote className="text-sm leading-relaxed text-fg/90">
              “{r.text}”
            </blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
