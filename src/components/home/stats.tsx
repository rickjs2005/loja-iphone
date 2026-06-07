import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const STATS = [
  { value: "+3.000", label: "aparelhos vendidos" },
  { value: "98%", label: "de satisfação" },
  { value: "4,9", label: "avaliação média" },
  { value: "100%", label: "com garantia" },
];

/** Faixa de números — credibilidade e prova social. */
export function Stats() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl sm:p-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-muted sm:text-base">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
