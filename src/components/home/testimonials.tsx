import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { StarIcon } from "@/components/ui/icons";

const REVIEWS = [
  {
    name: "Mariana S.",
    initials: "MS",
    local: "Belo Horizonte, MG",
    text: "Comprei meu iPhone 15 Pro e chegou em 2 dias, lacrado e com nota. Atendimento nota 10!",
  },
  {
    name: "Rafael T.",
    initials: "RT",
    local: "Governador Valadares, MG",
    text: "Estava com medo de golpe, mas a procedência foi toda comprovada. Recomendo demais.",
  },
  {
    name: "Juliana M.",
    initials: "JM",
    local: "Ipatinga, MG",
    text: "Preço bem melhor que a loja física e ainda com garantia. Já indiquei pra família toda.",
  },
];

/** Depoimentos com avaliação — prova social. */
export function Testimonials() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-5" />
                ))}
              </div>
              <span className="text-sm text-muted">
                <strong className="text-fg">4,9</strong> de 5
              </span>
            </div>
            <h2 className="text-2xl font-bold text-fg sm:text-3xl">
              Quem comprou, recomenda
            </h2>
            <p className="mt-2 text-muted">
              Centenas de clientes satisfeitos em toda a região.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="mb-3 flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <StarIcon key={j} className="size-4" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-fg/90">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                    {r.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-fg">
                      {r.name}
                    </span>
                    <span className="block text-xs text-muted">{r.local}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
