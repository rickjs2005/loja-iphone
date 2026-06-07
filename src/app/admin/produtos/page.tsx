import Link from "next/link";
import { ProductImage } from "@/components/product/product-image";
import { ActiveToggle } from "@/components/admin/active-toggle";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { requireUser } from "@/lib/auth/user";
import { getAllProducts } from "@/lib/data/products";
import { coverImage } from "@/lib/data/types";
import { formatCents } from "@/lib/format";
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
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Produtos</h1>
          <p className="text-sm text-zinc-500">
            {products.length} {products.length === 1 ? "item" : "itens"}
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
        >
          <PlusIcon className="size-4" />
          Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center text-zinc-500">
          Nenhum produto ainda. Crie o primeiro.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <ul className="divide-y divide-zinc-800">
            {products.map((product) => {
              const cover = coverImage(product);
              return (
                <li
                  key={product.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 transition-colors hover:bg-zinc-800/40 sm:p-4"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                    <ProductImage
                      url={cover?.url ?? null}
                      alt={product.name}
                      sizes="48px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {product.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-zinc-100">
                        {formatCents(product.price_cents)}
                      </span>
                      <span className="text-zinc-500">
                        {" "}
                        · <span className="font-mono tabular-nums">{product.stock}</span>{" "}
                        em estoque · {product.installments}x
                      </span>
                    </p>
                  </div>

                  <ActiveToggle id={product.id} active={product.is_active} />

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/produtos/${product.id}`}
                      className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      Editar
                    </Link>
                    <ConfirmDeleteButton
                      action={deleteProductAction}
                      fields={{ id: product.id }}
                      title="Excluir produto?"
                      description={`"${product.name}" e suas fotos serão removidos. Esta ação não pode ser desfeita.`}
                      triggerLabel={`Excluir ${product.name}`}
                      triggerClassName="inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <TrashIcon className="size-4" />
                    </ConfirmDeleteButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
