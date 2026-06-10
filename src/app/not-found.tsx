import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

/** 404 global (URLs que não casam com nenhuma rota, fora do grupo da loja). */
export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Erro 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted">
        O endereço pode estar incorreto ou a página foi removida.
      </p>
      <Link href="/" className={buttonClasses("primary", "lg", "mt-8")}>
        Voltar para a loja
      </Link>
    </Container>
  );
}
