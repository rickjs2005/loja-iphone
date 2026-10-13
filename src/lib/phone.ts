/**
 * Normalização e validação de números de WhatsApp (Brasil).
 *
 * Formato canônico — o ÚNICO que vai para o banco, o .env e os links wa.me:
 * só dígitos, com DDI 55 (ex.: "5511900000000"). O lojista pode digitar de
 * qualquer jeito comum — "(11) 90000-0000", "+55 11...", "011..." —
 * normalizeWhatsapp() converte tudo para o canônico antes de salvar.
 */

/**
 * Melhor esforço de conversão para o canônico (não valida — confira o
 * resultado com isValidWhatsapp). Regras, na ordem:
 * - descarta tudo que não é dígito;
 * - remove o 0 de discagem antes do DDD ("033 9..." → "33 9...");
 * - 10–11 dígitos = DDD + número local → ganha o DDI 55;
 * - celular antigo de 8 dígitos (começa em 6–9) ganha o nono dígito
 *   (regra ANATEL: prefixa 9), ex.: "11 8000-0000" → "5511980000000".
 */
export function normalizeWhatsapp(input: string): string {
  let d = input.replace(/\D/g, "").replace(/^0+/, "");
  if (d.length === 10 || d.length === 11) d = `55${d}`;
  if (/^55[1-9]\d[6-9]\d{7}$/.test(d)) d = `${d.slice(0, 4)}9${d.slice(4)}`;
  return d;
}

/**
 * Canônico válido? 55 + DDD (11–99) + celular com nono dígito (9XXXXXXXX)
 * ou fixo (2–5 + 7 dígitos — WhatsApp Business em fixo existe).
 */
const VALID_WHATSAPP_RE = /^55[1-9]\d(?:9\d{8}|[2-5]\d{7})$/;

export function isValidWhatsapp(digits: string): boolean {
  return VALID_WHATSAPP_RE.test(digits);
}

/** Canônico → leitura humana: "5511900000000" → "+55 (11) 90000-0000". */
export function formatWhatsappDisplay(digits: string): string {
  const m = /^55(\d{2})(\d{4,5})(\d{4})$/.exec(digits);
  if (!m) return digits;
  return `+55 (${m[1]}) ${m[2]}-${m[3]}`;
}

/**
 * Máscara para digitação ao vivo no input: vai formatando enquanto o lojista
 * digita, sem deixar passar caractere inválido. Mostra o formato local
 * "(11) 90000-0000" (sem o DDI). Suporta fixo (10 dígitos) e celular (11).
 * É só cosmético — quem normaliza para o canônico no submit é normalizeWhatsapp.
 */
export function maskWhatsappInput(input: string): string {
  let d = input.replace(/\D/g, "");
  // Colou com DDI (ex.: canônico "5511900000000")? remove o 55 da frente.
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}
