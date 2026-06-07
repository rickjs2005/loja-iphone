import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { PlusIcon } from "@/components/ui/icons";
import { requireUser } from "@/lib/auth/user";
import { getAllProducts } from "@/lib/data/products";
import { coverImage } from "@/lib/data/types";
import { formatCents } from "@/lib/format";
import { toggleActiveAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  await requireUser();
  const products = await getAllProducts();

  const ativos = products.filter((p) => p.is_active).length;
  const estoqueTotal = products.reduce((acc, p) => acc + p.stock, 0);
  const semEstoque = products.filter((p) => p.stock === 0).length;

  const dashboard = [
    { label: "Produtos ativos", value: ativos },
    { label: "Estoque total", value: estoqueTotal },
    { label: "Sem estoque", value: semEstoque },
  ];

  return (
    <div>
      {/* Dashboard rápido */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {dashboard.map((d) => (
          <div
            key={d.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-3xl font-bold text-fg sm:text-4xl">{d.value}</p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{d.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fg">Produtos</h1>
          <p className="text-sm text-muted">
            {products.length} {products.length === 1 ? "produto" : "produtos"}{" "}
            cadastrados
          </p>
        </div>
        <Link href="/admin/produtos/novo" className={buttonClasses("primary")}>
          <PlusIcon className="size-4" />
          Novo produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-surface/40 p-12 text-center text-muted">
          Nenhum produto ainda. Crie o primeiro!
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => {
            const cover = coverImage(product);
            return (
              <li
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-surface/60 p-3"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-bg">
                  <ProductImage
                    url={cover?.url ?? null}
                    alt={product.name}
                    sizes="64px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-fg">{product.name}</p>
                  <p className="text-sm text-muted">
                    {formatCents(product.price_cents)} · {product.stock} em
                    estoque
                  </p>
                </div>

                {/* Toggle ativo/inativo via Server Action */}
                <form action={toggleActiveAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <input
                    type="hidden"
                    name="next"
                    value={String(!product.is_active)}
                  />
                  <button
                    type="submit"
                    className={
                      product.is_active
                        ? "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30"
                        : "rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted ring-1 ring-white/10"
                    }
                  >
                    {product.is_active ? "Ativo" : "Inativo"}
                  </button>
                </form>

                <Link
                  href={`/admin/produtos/${product.id}`}
                  className={buttonClasses("outline", "sm")}
                >
                  Editar
                </Link>

                <DeleteProductButton id={product.id} name={product.name} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
