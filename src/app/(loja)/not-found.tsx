import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";

/** 404 da loja (também atende o notFound() da página de produto). */
export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center sm:py-32">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Erro 404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-muted">
        O produto pode ter sido vendido ou o link está incorreto. Dá uma olhada
        nos aparelhos disponíveis na loja.
      </p>
      <Link href="/" className={buttonClasses("primary", "lg", "mt-8")}>
        Voltar para a loja
      </Link>
    </Container>
  );
}
