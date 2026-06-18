/**
 * Helpers de FormData compartilhados entre as Server Actions do Admin.
 */

import { imageFileSchema } from "@/lib/validation/product.schema";

/**
 * Extrai só os campos de texto do FormData (descarta Files). Usado para ecoar
 * os valores digitados junto com o erro: o React 19 reseta o form pro
 * defaultValue ATUAL após a action — ecoar evita perder o que foi preenchido.
 */
export function echoValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

/**
 * Coleta os arquivos do campo `field` do FormData e valida TODOS antes de
 * qualquer upload — nada de upload parcial (um retry depois duplicaria as
 * fotos que já subiram). Retorna os arquivos válidos OU uma mensagem de erro
 * pronta pra UI. O caller faz o upload específico do seu domínio.
 */
export function collectValidImages(
  formData: FormData,
  field = "images",
): { ok: true; files: File[] } | { ok: false; error: string } {
  const files = formData
    .getAll(field)
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0)
    return { ok: false, error: "Selecione ao menos uma imagem." };
  for (const file of files) {
    const valid = imageFileSchema.safeParse(file);
    if (!valid.success) {
      return {
        ok: false,
        error: valid.error.issues[0]?.message ?? "Imagem inválida.",
      };
    }
  }
  return { ok: true, files };
}
