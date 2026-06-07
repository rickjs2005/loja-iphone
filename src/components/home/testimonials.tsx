import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { StarIcon } from "@/components/ui/icons";

const REVIEWS = [
  {
    name: "Mariana S.",
    text: "Comprei meu iPhone 15 Pro e chegou em 2 dias, lacrado e com nota. Atendimento nota 10!",
  },
  {
    name: "Rafael T.",
    text: "Estava com medo de golpe, mas a procedência foi toda comprovada. Recomendo demais.",
  },
  {
    name: "Juliana M.",
    text: "Preço bem melhor que a loja física e ainda com garantia. Já indiquei pra família toda.",
  },
];

/** Depoimentos com avaliação — prova social. */
export function Testimonials() {
  return (
    <section className="py-16">
      <Container>
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-fg sm:text-3xl">
              Quem comprou, recomenda
            </h2>
            <p className="mt-2 text-muted">
              Avaliação média de 4,9 em centenas de vendas.
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
                <figcaption className="mt-4 text-sm font-medium text-muted">
                  {r.name}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
