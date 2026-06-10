import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { Highlight } from "@/components/home/highlight";
import { Features } from "@/components/home/features";
import { StoreSection } from "@/components/home/store-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { AccessoriesSection } from "@/components/home/accessories-section";
import { CategoryNav } from "@/components/home/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { getActiveProducts } from "@/lib/data/products";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";
import { CATEGORIES, type ProductCategory } from "@/lib/data/types";

// Sempre buscar dados frescos (estoque/preço mudam no admin).
export const dynamic = "force-dynamic";

const LINE_SUBTITLES: Record<ProductCategory, string> = {
  iphone:
    "Modelos disponíveis para entrega imediata. Finalize pelo WhatsApp em segundos.",
  macbook: "Desempenho para trabalhar e criar, com a garantia da loja.",
  ipad: "Tela grande para estudar, criar e assistir onde quiser.",
  watch: "O complemento perfeito do seu iPhone, no seu pulso.",
  airpods: "Som imersivo com pareamento instantâneo.",
  accessory: "",
};

export default async function HomePage() {
  const [products, settings, lojaImgs, entregaImgs] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
    getSiteImages("loja"),
    getSiteImages("entrega"),
  ]);

  const accessories = products.filter((p) => p.category === "accessory");
  // Uma seção por linha Apple — só as que têm produto ativo.
  const lines = CATEGORIES.filter((c) => c.value !== "accessory")
    .map((c) => ({
      ...c,
      items: products.filter((p) => p.category === c.value),
    }))
    .filter((l) => l.items.length > 0);

  return (
    <>
      <Hero />
      <TrustBand />
      <Highlight />

      <CategoryNav products={products} />

      <div id="produtos" className="scroll-mt-20">
        {lines.map((line) => (
          <section
            key={line.value}
            id={`linha-${line.value}`}
            className="scroll-mt-20 py-16 sm:py-24"
          >
            <Container>
              <Reveal>
                <SectionHeading
                  eyebrow="Catálogo"
                  title={line.plural}
                  subtitle={LINE_SUBTITLES[line.value]}
                />
              </Reveal>

              <ProductGrid products={line.items} />
            </Container>
          </section>
        ))}

        {/* Catálogo vazio: mantém a seção com o aviso padrão da grade. */}
        {lines.length === 0 && (
          <section className="py-16 sm:py-24">
            <Container>
              <Reveal>
                <SectionHeading
                  title="Nossos produtos"
                  subtitle="Em breve novos aparelhos por aqui."
                />
              </Reveal>
              <ProductGrid products={[]} />
            </Container>
          </section>
        )}
      </div>

      <AccessoriesSection accessories={accessories} />

      <Features />
      <StoreSection settings={settings} images={lojaImgs} />
      <DeliverySection images={entregaImgs} />
    </>
  );
}
