import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { Highlight } from "@/components/home/highlight";
import { Stats } from "@/components/home/stats";
import { Features } from "@/components/home/features";
import { StoreSection } from "@/components/home/store-section";
import { DeliverySection } from "@/components/home/delivery-section";
import { AccessoriesSection } from "@/components/home/accessories-section";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { getActiveProducts } from "@/lib/data/products";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";

// Sempre buscar dados frescos (estoque/preço mudam no admin).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, settings, lojaImgs, entregaImgs] = await Promise.all([
    getActiveProducts(),
    getStoreSettings(),
    getSiteImages("loja"),
    getSiteImages("entrega"),
  ]);

  const iphones = products.filter((p) => p.category !== "accessory");
  const accessories = products.filter((p) => p.category === "accessory");

  return (
    <>
      <Hero />
      <TrustBand />
      <Highlight />

      <section id="produtos" className="scroll-mt-20 py-16 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              title="Escolha o seu iPhone"
              subtitle="Modelos disponíveis para entrega imediata. Finalize pelo WhatsApp em segundos."
            />
          </Reveal>

          <ProductGrid products={iphones} />
        </Container>
      </section>

      <AccessoriesSection accessories={accessories} />

      <Stats />
      <Features />
      <StoreSection settings={settings} images={lojaImgs} />
      <DeliverySection images={entregaImgs} />
    </>
  );
}
