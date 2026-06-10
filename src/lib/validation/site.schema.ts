import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

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
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
