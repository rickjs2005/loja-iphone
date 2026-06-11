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

/**
 * Trade-in: avaliação do aparelho usado. Com os dados do formulário a
 * mensagem já chega preenchida (modelo/bateria) — a loja responde na hora.
 * As FOTOS vão na própria conversa: link wa.me não carrega anexo.
 */
export function tradeInMessage(data?: {
  model?: string;
  battery?: string;
}): string {
  const model = data?.model?.trim() ?? "";
  const battery = data?.battery?.trim() ?? "";
  return [
    `Olá, ${storeConfig.name}! Quero dar meu iPhone usado como entrada.`,
    "",
    `Modelo do meu aparelho: ${model}`,
    `Saúde da bateria (%): ${battery}`,
    "",
    "Vou mandar as fotos em seguida. Quanto ele vale de crédito?",
  ].join("\n");
}

/** Abordagem genérica (header/footer). */
export function genericMessage(): string {
  return `Olá, ${storeConfig.name}! Vim pelo site e quero saber mais sobre os produtos disponíveis.`;
}
