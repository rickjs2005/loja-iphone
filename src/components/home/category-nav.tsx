import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORIES, type ProductWithImages } from "@/lib/data/types";

/**
 * Cards das linhas Apple (iPhone, MacBook, iPad...) que levam à seção de cada
 * uma. Só aparecem as linhas com produto ativo; com uma única linha no
 * catálogo, a navegação não ajuda em nada e a faixa inteira some.
 */
export function CategoryNav({ products }: { products: ProductWithImages[] }) {
  const cards = CATEGORIES.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.value).length,
  })).filter((c) => c.count > 0);

  if (cards.length < 2) return null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((c, i) => (
            <Reveal key={c.value} delay={i * 0.05}>
              <a
                href={
                  c.value === "accessory" ? "#acessorios" : `#linha-${c.value}`
                }
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur transition-colors hover:border-white/30 hover:bg-white/[0.06] sm:p-5"
              >
                <p className="text-base font-semibold text-fg sm:text-lg">
                  {c.plural}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {c.count} {c.count === 1 ? "modelo" : "modelos"}
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
