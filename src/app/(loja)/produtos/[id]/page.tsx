import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { Gallery } from "@/components/product/gallery";
import { StockBadge } from "@/components/product/stock-badge";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { MobilePurchaseBar } from "@/components/cart/mobile-purchase-bar";
import { Specs } from "@/components/product/specs";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { ChevronLeftIcon, ShieldIcon, WhatsappIcon } from "@/components/ui/icons";
import { getActiveProducts, getProductById } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/site";
import { coverImage } from "@/lib/data/types";
import { formatCents, formatInstallments } from "@/lib/format";
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
  const settings = await getStoreSettings();
  const related = (await getActiveProducts())
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);
  const isAccessory = product.category === "accessory";

  return (
    <Container className="py-8 pb-28 sm:py-12 lg:pb-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-fg"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar para a loja
      </Link>

      {/* Topo: galeria + compra */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery
          images={product.images}
          productName={product.name}
          productId={product.id}
          accessory={isAccessory}
        />

        <div className="flex flex-col self-start lg:sticky lg:top-24">
          <StockBadge stock={product.stock} className="mb-4 w-fit" />

          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-4xl font-extrabold tracking-tight text-fg">
            {formatCents(product.price_cents)}
          </p>
          <p className="mt-1 text-muted">
            ou {formatInstallments(product.price_cents, product.installments)}{" "}
            sem juros
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <ShieldIcon className="size-4 text-emerald-400" />
            Garantia inclusa · aparelho testado e com procedência
          </div>
          {settings.payment_methods && (
            <p className="mt-2 text-sm text-muted">
              <span className="text-fg">Pagamento:</span>{" "}
              {settings.payment_methods}
            </p>
          )}

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
                category: isAccessory ? "accessory" : "iphone",
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

      {/* Seções da mini-landing */}
      <div className="mt-16 flex flex-col gap-16">
        <Specs />
        <ProductReviews />
        <RelatedProducts products={related} />
      </div>

      <MobilePurchaseBar
        product={{
          productId: product.id,
          name: product.name,
          priceCents: product.price_cents,
          imageUrl: cover?.url ?? null,
          stock: product.stock,
          category: isAccessory ? "accessory" : "iphone",
        }}
      />
    </Container>
  );
}
