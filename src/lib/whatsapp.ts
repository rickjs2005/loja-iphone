import { storeConfig } from "@/config/theme.config";
import { formatCents } from "@/lib/format";
import type { CartItem } from "@/lib/cart/store";

/**
 * Monta o link do WhatsApp com o resumo do pedido. O fechamento é 100% no
 * WhatsApp da loja — não há gateway de pagamento.
 */
export function buildWhatsappUrl(items: CartItem[], totalCents: number): string {
  const linhas = items.map(
    (i) =>
      `• ${i.quantity}x ${i.name} — ${formatCents(i.priceCents * i.quantity)}`,
  );

  const mensagem = [
    `Olá, ${storeConfig.name}! Tenho interesse nos itens abaixo:`,
    "",
    ...linhas,
    "",
    `*Total: ${formatCents(totalCents)}*`,
    "",
    "Pode me ajudar a finalizar?",
  ].join("\n");

  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Trade-in: abre o WhatsApp já no fluxo de avaliação do aparelho usado. */
export function buildTradeInUrl(): string {
  const mensagem = [
    `Olá, ${storeConfig.name}! Quero dar meu iPhone usado como entrada.`,
    "",
    "Modelo do meu aparelho:",
    "Saúde da bateria (%):",
    "",
    "Vou mandar as fotos em seguida. Quanto ele vale de crédito?",
  ].join("\n");
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Link simples para tirar dúvidas sobre um produto específico. */
export function buildProductInquiryUrl(productName: string): string {
  const mensagem = `Olá, ${storeConfig.name}! Tenho interesse no ${productName}. Está disponível?`;
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Mesma base do metadataBase no layout raiz (NEXT_PUBLIC_* é inlinado no client).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * "Comprar agora": mensagem completa com nome, preço e link do produto —
 * a loja identifica o aparelho na hora, sem ida obrigatória ao carrinho.
 */
export function buildBuyNowUrl(product: {
  id: string;
  name: string;
  priceCents: number;
  quantity?: number;
}): string {
  const qty = product.quantity ?? 1;
  const mensagem = [
    `Olá, ${storeConfig.name}! Quero comprar:`,
    "",
    `• ${qty}x ${product.name} — ${formatCents(product.priceCents * qty)}`,
    `${siteUrl}/produtos/${product.id}`,
    "",
    "Pode me ajudar a finalizar?",
  ].join("\n");

  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
