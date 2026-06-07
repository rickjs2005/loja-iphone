import Link from "next/link";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { ProductForm } from "@/components/admin/product-form";
import { requireUser } from "@/lib/auth/user";

export default async function NovoProdutoPage() {
  await requireUser();

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-fg">Novo produto</h1>
      <p className="mb-6 text-sm text-muted">
        Cadastre os dados. As fotos são adicionadas na próxima etapa.
      </p>

      <ProductForm />
    </div>
  );
}
