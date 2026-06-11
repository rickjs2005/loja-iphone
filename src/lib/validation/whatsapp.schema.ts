import { z } from "zod";
import { isValidWhatsapp, normalizeWhatsapp } from "@/lib/phone";

/**
 * Campo de WhatsApp dos forms do admin (Informações da loja e Unidades).
 * Aceita máscara, +55, 0 do DDD, celular sem o nono dígito... e SALVA sempre
 * o canônico (só dígitos com DDI 55) — links wa.me nunca mais saem quebrados.
 */
export const whatsappField = z
  .string()
  .trim()
  .transform(normalizeWhatsapp)
  .refine(
    isValidWhatsapp,
    "Número inválido — confira o DDD e o número (ex.: 33 99983-0475)",
  );
