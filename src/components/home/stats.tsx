import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { getStoreSettings } from "@/lib/data/site";

/**
 * Faixa de números com contador animado — credibilidade.
 * Os valores vêm do admin (Conteúdo da loja); só aparecem os preenchidos e,
 * sem nenhum, a seção inteira some (nada de número fictício em loja real).
 */
export async function Stats() {
  const s = await getStoreSettings();

  const items = [
    s.stat_sold != null && {
      value: s.stat_sold,
      prefix: "+",
      suffix: "",
      decimals: 0,
      label: "aparelhos vendidos",
    },
    s.stat_satisfaction != null && {
      value: s.stat_satisfaction,
      prefix: "",
      suffix: "%",
      decimals: 0,
      label: "de satisfação",
    },
    s.stat_rating != null && {
      value: Number(s.stat_rating),
      prefix: "",
      suffix: "",
      decimals: 1,
      label: "avaliação média",
    },
    s.stat_reviews != null && {
      value: s.stat_reviews,
      prefix: "+",
      suffix: "",
      decimals: 0,
      label: "avaliações de clientes",
    },
  ].filter((i): i is Exclude<typeof i, false> => Boolean(i));

  if (items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-wrap justify-center gap-x-14 gap-y-8 rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl sm:p-10">
          {items.map((s, i) => (
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
