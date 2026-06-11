import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { ProductForm } from "@/components/admin/product-form";
import { ImageManager } from "@/components/admin/image-manager";
import { requireAdmin } from "@/lib/auth/user";
import { getProductById } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/site";
import { getProductInventory, getUnits } from "@/lib/data/units";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  // Com o modo ligado e unidades cadastradas, o form mostra o estoque por
  // unidade; desligado, estoque único (compartilhado entre as lojas).
  const [product, units, inventory, settings] = await Promise.all([
    getProductById(id),
    getUnits(),
    getProductInventory(id),
    getStoreSettings(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar
      </Link>

      <h1 className="mb-6 text-xl font-semibold text-zinc-100">Editar produto</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Dados
          </h2>
          <ProductForm
            product={product}
            units={units}
            inventory={inventory}
            trackStockByUnit={settings.track_stock_by_unit}
          />
        </section>

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Fotos
          </h2>
          <ImageManager productId={product.id} images={product.images} />
        </section>
      </div>
    </div>
  );
}
