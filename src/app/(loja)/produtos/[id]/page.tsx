import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Gallery } from "@/components/product/gallery";
import { StockBadge } from "@/components/product/stock-badge";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { MobilePurchaseBar } from "@/components/cart/mobile-purchase-bar";
import { Specs } from "@/components/product/specs";
import { RelatedProducts } from "@/components/product/related-products";
import { ChevronLeftIcon, ShieldIcon, WhatsappIcon } from "@/components/ui/icons";
import { getProductById, getRelatedProducts } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/site";
import { coverImage } from "@/lib/data/types";
import { formatCents, formatInstallments } from "@/lib/format";
import { buildProductInquiryUrl } from "@/lib/whatsapp";
import { storeConfig } from "@/config/theme.config";
import { ConditionCard } from "@/components/product/condition-card";
import { UnitAvailability } from "@/components/product/unit-availability";

// Página sempre dinâmica: preço/estoque mudam com frequência.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

// Mesma base do metadataBase no layout raiz.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Validade da oferta no JSON-LD: hoje + 30 dias (recomendado pelo Google).
 * Fora do componente para satisfazer a regra de pureza do render — roda no
 * servidor a cada request (página é force-dynamic).
 */
function offerValidUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Produto não encontrado" };

  const description =
    product.description ??
    `${product.name} com garantia por ${formatCents(product.price_cents)} · ${storeConfig.name}`;
  const cover = coverImage(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/produtos/${product.id}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `/produtos/${product.id}`,
      ...(cover ? { images: [cover.url] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  // Fetches independentes em paralelo (getProductById deduplicado com o
  // generateMetadata via React.cache).
  const [product, settings] = await Promise.all([
    getProductById(id),
    getStoreSettings(),
  ]);
  if (!product) notFound();

  const cover = coverImage(product);
  // Relacionados filtrados e limitados no banco (não mais o catálogo inteiro).
  const related = await getRelatedProducts(product.category, product.id);
  const isAccessory = product.category === "accessory";

  // Dados estruturados (Product + Offer) para rich results nos buscadores.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ??
      `${product.name} com garantia · ${storeConfig.name}`,
    image: product.images.map((img) => img.url),
    // Acessórios podem ser de outras marcas — só iPhone leva brand Apple.
    ...(isAccessory ? {} : { brand: { "@type": "Brand", name: "Apple" } }),
    // Condição do aparelho: "novo" = lacrado; demais condições = seminovo.
    ...(product.condition
      ? {
          itemCondition:
            product.condition === "novo"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/RefurbishedCondition",
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: (product.price_cents / 100).toFixed(2),
      priceCurrency: "BRL",
      // Oferta válida por 30 dias a partir de hoje.
      priceValidUntil: offerValidUntil(),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${siteUrl}/produtos/${product.id}`,
    },
  };

  return (
    <Container className="py-8 pb-28 sm:py-12 lg:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <ShieldIcon className="size-4 text-fg/60" />
            {settings.warranty_text?.trim() || "Garantia inclusa"} · aparelho
            testado e com procedência
          </div>
          {settings.payment_methods && (
            <p className="mt-2 text-sm text-muted">
              <span className="text-fg">Pagamento:</span>{" "}
              {settings.payment_methods}
            </p>
          )}

          {/* Estado real do aparelho (cadastrado no admin) — só para iPhones. */}
          {!isAccessory && (
            <ConditionCard
              batteryHealth={product.battery_health}
              condition={product.condition}
            />
          )}

          {/* Estoque por unidade — renderiza para aparelhos e acessórios;
              o componente some sozinho com menos de duas unidades. */}
          <UnitAvailability productId={product.id} />

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

          {/* Secundário: o CTA verde de compra agora vive no PurchasePanel. */}
          <a
            href={buildProductInquiryUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 self-center text-sm text-muted transition-colors hover:text-fg"
          >
            <WhatsappIcon className="size-4" />
            Ficou com dúvida? Fale com a gente no WhatsApp
          </a>
        </div>
      </div>

      {/* Seções da mini-landing */}
      <div className="mt-16 flex flex-col gap-16">
        <Specs warrantyText={settings.warranty_text} />
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
