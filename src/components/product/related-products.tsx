import { ProductGrid } from "@/components/product/product-grid";
import type { ProductWithImages } from "@/lib/data/types";

/** "Você também pode gostar" — outros produtos ativos da loja. */
export function RelatedProducts({
  products,
}: {
  products: ProductWithImages[];
}) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-fg">
        Você também pode gostar
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
