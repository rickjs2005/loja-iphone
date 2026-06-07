import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { Gallery } from "@/components/product/gallery";
import { StockBadge } from "@/components/product/stock-badge";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { ChevronLeftIcon, WhatsappIcon } from "@/components/ui/icons";
import { getProductById } from "@/lib/data/products";
import { coverImage } from "@/lib/data/types";
import { formatCents } from "@/lib/format";
import { buildProductInquiryUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produto não encontrado" };
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const cover = coverImage(product);

  return (
    <Container className="py-8 sm:py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar para a loja
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          <StockBadge stock={product.stock} className="mb-4 w-fit" />

          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-primary">
            {formatCents(product.price_cents)}
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <PurchasePanel
              product={{
                productId: product.id,
                name: product.name,
                priceCents: product.price_cents,
                imageUrl: cover?.url ?? null,
                stock: product.stock,
              }}
            />
          </div>

          <a
            href={buildProductInquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "lg", "mt-3 w-full")}
          >
            <WhatsappIcon className="size-5" />
            Tirar dúvida no WhatsApp
          </a>
        </div>
      </div>
    </Container>
  );
}
