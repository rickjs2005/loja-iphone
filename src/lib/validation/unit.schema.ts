import { z } from "zod";
import { whatsappField } from "@/lib/validation/whatsapp.schema";

// Campos ausentes do FormData chegam como null; vazio e null = "não informado".
const emptyToUndefined = (v: unknown) =>
  v === null || (typeof v === "string" && v.trim() === "") ? undefined : v;

/** Unidade física da loja (Centro, Shopping...). Só o nome é obrigatório. */
export const unitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Dê um nome à unidade (ex.: Centro)")
    .max(80, "Nome muito longo"),
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
  hours: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  whatsapp: z.preprocess(emptyToUndefined, whatsappField.optional()),
  maps_url: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .url("Link do mapa inválido")
      .max(500)
      .refine(
        (u) => /^https?:\/\//i.test(u),
        "O link deve começar com http:// ou https://",
      )
      .optional(),
  ),
  sort_order: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .transform((v) => v ?? 0),
});

export type UnitInput = z.infer<typeof unitSchema>;
