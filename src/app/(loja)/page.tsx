import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
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

      <section id="produtos" className="scroll-mt-20 py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                Escolha o seu iPhone
              </h2>
              <p className="mt-3 text-lg text-muted">
                Modelos disponíveis para entrega imediata. Finalize pelo
                WhatsApp em segundos.
              </p>
            </div>
          </Reveal>

          <ProductGrid products={products} />
        </Container>
      </section>

      <Features />
      <Testimonials />
    </>
  );
}
