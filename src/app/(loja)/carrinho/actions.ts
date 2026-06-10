"use server";

import { z } from "zod";
import { getProductsState } from "@/lib/data/products";

/** Quantos itens de carrinho aceitamos revalidar por chamada. */
const MAX_IDS = 50;

const uuidSchema = z.uuid();

/**
 * Revalida o estado (preço/estoque/ativo) dos itens do carrinho.
 * Leitura pública — sem requireUser; RLS já restringe ao catálogo visível.
 * Ids inválidos são ignorados (o carrinho vive em localStorage, então a
 * entrada é, por definição, não confiável).
 */
export async function syncCartAction(
  ids: string[],
): Promise<
  { id: string; price_cents: number; stock: number; is_active: boolean }[]
> {
  if (!Array.isArray(ids)) return [];

  const valid = ids
    .filter(
      (id): id is string =>
        typeof id === "string" && uuidSchema.safeParse(id).success,
    )
    .slice(0, MAX_IDS);

  if (valid.length === 0) return [];
  return getProductsState(valid);
}
