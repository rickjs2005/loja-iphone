import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductImage } from "@/components/product/product-image";
import { CATEGORIES, type ProductWithImages } from "@/lib/data/types";
import { copy } from "@/config/copy";

/**
 * Cards das linhas Apple (iPhone, MacBook, iPad...) com foto de capa — a capa
 * é a primeira foto do primeiro produto da linha que tiver imagem. Só aparecem
 * as linhas com produto ativo; com uma única linha no catálogo, a navegação
 * não ajuda em nada e a faixa inteira some.
 */
export function CategoryNav({ products }: { products: ProductWithImages[] }) {
  const cards = CATEGORIES.map((c) => ({
    ...c,
    count: products.filter((p) => p.category === c.value).length,
    coverUrl:
      products.find((p) => p.category === c.value && p.images[0])?.images[0]
        ?.url ?? null,
  })).filter((c) => c.count > 0);

  if (cards.length < 2) return null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SectionHeading
          align="left"
          eyebrow={copy.categoryNav.eyebrow}
          title={copy.categoryNav.title}
          action={
            <a href="#produtos" className="text-sm text-primary hover:underline">
              Ver todas →
            </a>
          }
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.value} delay={i * 0.05}>
              <a
                href={
                  c.value === "accessory" ? "#acessorios" : `#linha-${c.value}`
                }
                className="group glass glass-rim block overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
              >
                {/* Foto de capa da linha com gradiente de leitura na base */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <ProductImage
                      url={c.coverUrl}
                      alt={c.plural}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      variant={c.value === "accessory" ? "accessory" : "iphone"}
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="font-semibold text-fg">{c.plural}</p>
                    <p className="text-xs text-muted">
                      {c.count} {c.count === 1 ? "modelo" : "modelos"}
                    </p>
                    <p className="mt-1 text-sm text-primary">
                      Ver modelos
                      <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </p>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
