import { z } from "zod";

/**
 * Schemas Zod para validar os inputs do admin ANTES de tocar o banco.
 * Usados dentro das Server Actions. Valores vêm de FormData (strings), por isso
 * usamos coerção onde necessário.
 */

// Campos condicionais do form chegam como null (ausentes do FormData) ou ""
// (select/input vazio): ambos significam "não informado".
const emptyToUndefined = (v: unknown) =>
  v === null || (typeof v === "string" && v.trim() === "") ? undefined : v;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do produto")
    .max(120, "Nome muito longo"),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000, "Descrição muito longa").optional(),
  ),
  // Preço canônico em CENTAVOS (inteiro não-negativo).
  price_cents: z.coerce
    .number({ message: "Preço inválido" })
    .int("O preço deve ser um inteiro em centavos")
    .min(0, "O preço não pode ser negativo"),
  stock: z.coerce
    .number({ message: "Estoque inválido" })
    .int("O estoque deve ser um número inteiro")
    .min(0, "O estoque não pode ser negativo"),
  installments: z.coerce
    .number({ message: "Parcelas inválidas" })
    .int("Use um número inteiro de parcelas")
    .min(1, "Mínimo de 1 parcela")
    .max(24, "Máximo de 24 parcelas")
    .optional()
    .transform((v) => v ?? 12),
  category: z.enum(["iphone", "accessory"]).default("iphone"),
  accessory_category: z.preprocess(
    emptyToUndefined,
    z.enum(["carregadores", "capas", "audio", "outros"]).optional(),
  ),
  battery_health: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).max(100).optional(),
  ),
  condition: z.preprocess(
    emptyToUndefined,
    z.enum(["vitrine", "excelente", "bom"]).optional(),
  ),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .transform((v) => v ?? 0),
});

export type ProductInput = z.infer<typeof productSchema>;

/** Validação de imagem no upload (tipo e tamanho). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const imageFileSchema = z
  .instanceof(File, { message: "Arquivo inválido" })
  .refine((f) => f.size > 0, "Arquivo vazio")
  .refine((f) => f.size <= MAX_IMAGE_BYTES, "A imagem deve ter no máximo 5 MB")
  .refine(
    (f) => (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(f.type),
    "Formato não suportado (use JPG, PNG ou WebP)",
  );
