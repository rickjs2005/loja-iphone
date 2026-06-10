import Link from "next/link";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth/user";
import { getUnits } from "@/lib/data/units";

export default async function NovoProdutoPage() {
  await requireAdmin();
  // Com unidades cadastradas, o form pede o estoque por unidade.
  const units = await getUnits();

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar
      </Link>

      <h1 className="mb-1 text-xl font-semibold text-zinc-100">Novo produto</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Cadastre os dados. As fotos são adicionadas na próxima etapa.
      </p>

      <ProductForm units={units} />
    </div>
  );
}
