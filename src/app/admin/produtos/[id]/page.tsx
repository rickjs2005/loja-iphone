import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { ProductForm } from "@/components/admin/product-form";
import { ImageManager } from "@/components/admin/image-manager";
import { requireUser } from "@/lib/auth/user";
import { getProductById } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-fg">Editar produto</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Dados
          </h2>
          <ProductForm product={product} />
        </section>

        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Fotos
          </h2>
          <ImageManager productId={product.id} images={product.images} />
        </section>
      </div>
    </div>
  );
}
