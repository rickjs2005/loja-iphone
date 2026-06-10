import { z } from "zod";

// Campos ausentes do FormData chegam como null; vazio e null = "não informado".
const emptyToUndefined = (v: unknown) =>
  v === null || (typeof v === "string" && v.trim() === "") ? undefined : v;

export const siteSettingsSchema = z.object({
  address: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(300).optional(),
  ),
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
  // Números da loja (prova social). Vazio = a seção some da loja pública.
  stat_sold: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ message: "Número inválido" })
      .int("Use um número inteiro")
      .min(0)
      .max(1_000_000)
      .optional(),
  ),
  stat_rating: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ message: "Nota inválida" })
      .min(0, "A nota vai de 0 a 5")
      .max(5, "A nota vai de 0 a 5")
      .optional(),
  ),
  stat_reviews: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ message: "Número inválido" })
      .int("Use um número inteiro")
      .min(0)
      .max(1_000_000)
      .optional(),
  ),
  stat_satisfaction: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ message: "Porcentagem inválida" })
      .int("Use um número inteiro")
      .min(0, "De 0 a 100")
      .max(100, "De 0 a 100")
      .optional(),
  ),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/** Depoimento de cliente (cadastrado no admin, exibido na página do produto). */
export const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do cliente")
    .max(60, "Nome muito longo"),
  text: z
    .string()
    .trim()
    .min(1, "Escreva o depoimento")
    .max(300, "Depoimento muito longo (máx. 300 caracteres)"),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
