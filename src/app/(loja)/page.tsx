import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { TradeIn } from "@/components/home/trade-in";
import { Features } from "@/components/home/features";
import { StoreSection } from "@/components/home/store-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { AccessoriesSection } from "@/components/home/accessories-section";
import { InstagramSection } from "@/components/home/instagram-section";
import { CategoryNav } from "@/components/home/category-nav";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { getActiveProducts } from "@/lib/data/products";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";
import { getUnits } from "@/lib/data/units";
import { CATEGORIES } from "@/lib/data/types";
import { copy } from "@/config/copy";

// Sempre buscar dados frescos (estoque/preço mudam no admin).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, settings, lojaImgs, entregaImgs, instagramImgs, units] =
    await Promise.all([
      getActiveProducts(),
      getStoreSettings(),
      getSiteImages("loja"),
      getSiteImages("entrega"),
      getSiteImages("instagram"),
      getUnits(),
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
      <TradeIn />

      <CategoryNav products={products} />

      <div id="produtos" className="scroll-mt-20">
        {lines.map((line) => (
          <section
            key={line.value}
            id={`linha-${line.value}`}
            className="scroll-mt-20 py-14 sm:py-20"
          >
            <Container>
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow={copy.catalog.eyebrow}
                  title={copy.catalog.lineTitle.replace("{linha}", line.plural)}
                  subtitle={copy.catalog.lineSubtitles[line.value]}
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
                  title={copy.catalog.emptyTitle}
                  subtitle={copy.catalog.emptySubtitle}
                />
              </Reveal>
              <ProductGrid products={[]} />
            </Container>
          </section>
        )}
      </div>

      <AccessoriesSection accessories={accessories} />

      <Features />
      <StoreSection settings={settings} images={lojaImgs} units={units} />
      <DeliverySection images={entregaImgs} />
      <InstagramSection images={instagramImgs} />
    </>
  );
}
