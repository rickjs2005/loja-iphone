import { storeConfig } from "@/config/theme.config";
import { formatCents } from "@/lib/format";
import { normalizeWhatsapp } from "@/lib/phone";
import type { CartItem } from "@/lib/cart/store";

/**
 * Mensagens prontas de WhatsApp (TEXTO cru). Quem escolhe o NÚMERO é o
 * <WhatsappCta>: a unidade que o cliente selecionar, ou o número geral
 * configurado no admin (com o white-label como reserva). Não monte links
 * wa.me por fora — sempre passe por ele (ou, quando o número já é fixo,
 * use waUrl para o link sempre sair com mensagem).
 */

/**
 * Link wa.me com a mensagem encodada — nunca abra conversa sem texto.
 * O número passa pelo normalizeWhatsapp: dados antigos do banco ou env vars
 * com máscara/espaços não geram link quebrado.
 */
export function waUrl(phone: string, message: string): string {
  return `https://wa.me/${normalizeWhatsapp(phone)}?text=${encodeURIComponent(message)}`;
}

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

/** Dúvida sobre um produto específico. */
export function productInquiryMessage(productName: string): string {
  return `Olá, ${storeConfig.name}! Tenho interesse no ${productName}. Está disponível?`;
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
