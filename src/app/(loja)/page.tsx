import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { Highlight } from "@/components/home/highlight";
import { Stats } from "@/components/home/stats";
import { Features } from "@/components/home/features";
import { Testimonials } from "@/components/home/testimonials";
import { ProductGrid } from "@/components/product/product-grid";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import { getActiveProducts } from "@/lib/data/products";

// Sempre buscar dados frescos (estoque/preço mudam no admin).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Hero />
      <TrustBand />
      <Highlight />

      <section id="produtos" className="scroll-mt-20 py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-5xl">
                Escolha o seu iPhone
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted sm:text-xl">
                Modelos disponíveis para entrega imediata. Finalize pelo
                WhatsApp em segundos.
              </p>
            </div>
          </Reveal>

          <ProductGrid products={products} />
        </Container>
      </section>

      <Stats />
      <Features />
      <Testimonials />
    </>
  );
}
