import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

const STATS = [
  { value: 3000, prefix: "+", suffix: "", decimals: 0, label: "aparelhos vendidos" },
  { value: 98, prefix: "", suffix: "%", decimals: 0, label: "de satisfação" },
  { value: 4.9, prefix: "", suffix: "", decimals: 1, label: "avaliação média" },
  { value: 100, prefix: "", suffix: "%", decimals: 0, label: "com garantia" },
];

/** Faixa de números com contador animado — credibilidade. */
export function Stats() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl sm:p-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                <CountUp
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
              </p>
              <p className="mt-2 text-sm text-muted sm:text-base">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
