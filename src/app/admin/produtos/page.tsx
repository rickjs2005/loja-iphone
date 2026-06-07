import Link from "next/link";
import { ProductList } from "@/components/admin/product-list";
import { PlusIcon } from "@/components/ui/icons";
import { requireUser } from "@/lib/auth/user";
import { getAllProducts } from "@/lib/data/products";
import { deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  await requireUser();
  const products = await getAllProducts();

  const metrics = [
    { label: "Produtos ativos", value: products.filter((p) => p.is_active).length },
    { label: "Estoque total", value: products.reduce((a, p) => a + p.stock, 0) },
    { label: "Sem estoque", value: products.filter((p) => p.stock === 0).length },
  ];

  return (
    <div>
      {/* Dashboard rápido */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5"
          >
            <p className="font-mono text-3xl font-semibold tabular-nums text-zinc-100 sm:text-4xl">
              {m.value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400 sm:text-xs">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-zinc-100">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <PlusIcon className="size-4" />
          Novo produto
        </Link>
      </div>

      <ProductList products={products} deleteAction={deleteProductAction} />
    </div>
  );
}
