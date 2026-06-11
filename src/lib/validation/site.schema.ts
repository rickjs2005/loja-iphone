import { z } from "zod";
import { whatsappField } from "@/lib/validation/whatsapp.schema";

// Campos ausentes do FormData chegam como null; vazio e null = "não informado".
const emptyToUndefined = (v: unknown) =>
  v === null || (typeof v === "string" && v.trim() === "") ? undefined : v;

export const siteSettingsSchema = z.object({
  // Endereço estruturado (mesmo formato das unidades); nada obrigatório.
  city: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  neighborhood: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120).optional(),
  ),
  street: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  number: z.preprocess(emptyToUndefined, z.string().trim().max(20).optional()),
  reference: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(200).optional(),
  ),
  whatsapp: z.preprocess(emptyToUndefined, whatsappField.optional()),
  hours: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  maps_url: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .url("Link do mapa inválido")
      .max(500)
      // `url()` aceita qualquer esquema (até javascript:) — só http/https aqui.
      .refine(
        (u) => /^https?:\/\//i.test(u),
        "O link deve começar com http:// ou https://",
      )
      .optional(),
  ),
  payment_methods: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(300).optional(),
  ),
  warranty_text: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120, "Texto da garantia muito longo").optional(),
  ),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/** Legenda opcional de uma foto da loja/entrega. Vazio = sem legenda. */
export const siteImageCaptionSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().max(120, "Legenda muito longa (máx. 120)").optional(),
);
