import { Hero } from "@/components/home/hero";
import { ProductGrid } from "@/components/product/product-grid";
import { Container } from "@/components/ui/container";
import { getActiveProducts } from "@/lib/data/products";

// Sempre buscar dados frescos (estoque/preço mudam no admin).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Hero />

      <section id="produtos" className="scroll-mt-20 py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-fg sm:text-3xl">
                Modelos disponíveis
              </h2>
              <p className="mt-1 text-muted">
                Escolha o seu e finalize a compra pelo WhatsApp.
              </p>
            </div>
          </div>

          <ProductGrid products={products} />
        </Container>
      </section>
    </>
  );
}
