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

/** Link simples para tirar dúvidas sobre um produto específico. */
export function buildProductInquiryUrl(productName: string): string {
  const mensagem = `Olá, ${storeConfig.name}! Tenho interesse no ${productName}. Está disponível?`;
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
