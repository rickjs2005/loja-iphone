import { storeConfig } from "@/config/theme.config";
import { formatCents } from "@/lib/format";
import type { CartItem } from "@/lib/cart/store";

/**
 * Mensagens prontas de WhatsApp. As funções *Message retornam o TEXTO cru
 * (o <WhatsappCta> escolhe o número — da unidade que o cliente selecionar
 * ou o geral); as *Url montam o link completo com o número geral, para os
 * pontos que não passam pelo seletor de unidade.
 */

const waUrl = (message: string, phone = storeConfig.whatsapp) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

/** Resumo do pedido do carrinho (fechamento 100% no WhatsApp). */
export function cartMessage(items: CartItem[], totalCents: number): string {
  const linhas = items.map(
    (i) =>
      `• ${i.quantity}x ${i.name} — ${formatCents(i.priceCents * i.quantity)}`,
  );

  return [
    `Olá, ${storeConfig.name}! Tenho interesse nos itens abaixo:`,
    "",
    ...linhas,
    "",
    `*Total: ${formatCents(totalCents)}*`,
    "",
    "Pode me ajudar a finalizar?",
  ].join("\n");
}

export function buildWhatsappUrl(items: CartItem[], totalCents: number): string {
  return waUrl(cartMessage(items, totalCents));
}

/** Dúvida sobre um produto específico. */
export function productInquiryMessage(productName: string): string {
  return `Olá, ${storeConfig.name}! Tenho interesse no ${productName}. Está disponível?`;
}

export function buildProductInquiryUrl(productName: string): string {
  return waUrl(productInquiryMessage(productName));
}

/** Trade-in: fluxo de avaliação do aparelho usado. */
export function tradeInMessage(): string {
  return [
    `Olá, ${storeConfig.name}! Quero dar meu iPhone usado como entrada.`,
    "",
    "Modelo do meu aparelho:",
    "Saúde da bateria (%):",
    "",
    "Vou mandar as fotos em seguida. Quanto ele vale de crédito?",
  ].join("\n");
}

export function buildTradeInUrl(): string {
  return waUrl(tradeInMessage());
}

/** Abordagem genérica (header/footer). */
export function genericMessage(): string {
  return `Olá, ${storeConfig.name}! Vim pelo site e quero saber mais sobre os produtos disponíveis.`;
}

// Mesma base do metadataBase no layout raiz (NEXT_PUBLIC_* é inlinado no client).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * "Comprar agora": mensagem completa com nome, preço e link do produto —
 * a loja identifica o aparelho na hora, sem ida obrigatória ao carrinho.
 */
export function buyNowMessage(product: {
  id: string;
  name: string;
  priceCents: number;
  quantity?: number;
}): string {
  const qty = product.quantity ?? 1;
  return [
    `Olá, ${storeConfig.name}! Quero comprar:`,
    "",
    `• ${qty}x ${product.name} — ${formatCents(product.priceCents * qty)}`,
    `${siteUrl}/produtos/${product.id}`,
    "",
    "Pode me ajudar a finalizar?",
  ].join("\n");
}

export function buildBuyNowUrl(product: {
  id: string;
  name: string;
  priceCents: number;
  quantity?: number;
}): string {
  return waUrl(buyNowMessage(product));
}
