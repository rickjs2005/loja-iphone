import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UnitInput } from "@/lib/validation/unit.schema";
import type { InventoryRow, UnitRow } from "@/types/database.types";

/**
 * Camada de dados das UNIDADES FÍSICAS e do estoque por unidade.
 * products.stock continua sendo o TOTAL: um trigger no banco soma o
 * inventory a cada mudança, então o resto do app não precisa saber de
 * unidades. Loja sem unidade cadastrada opera no modo de estoque único.
 */

export const getUnits = cache(async (): Promise<UnitRow[]> => {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Falha ao listar unidades: ${error.message}`);
  return data ?? [];
});

/** Estoque por unidade de um produto (linhas ausentes = 0 naquela unidade). */
export const getProductInventory = cache(
  async (productId: string): Promise<InventoryRow[]> => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("product_id", productId);

    if (error) throw new Error(`Falha ao buscar estoque: ${error.message}`);
    return data ?? [];
  },
);

// --------------------------------------------------------------------------
// Escrita (admin autenticado; RLS exige is_admin)
// --------------------------------------------------------------------------

export async function createUnit(
  input: UnitInput,
  photoUrl?: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("units")
    .insert({
      name: input.name,
      city: input.city ?? null,
      neighborhood: input.neighborhood ?? null,
      street: input.street ?? null,
      number: input.number ?? null,
      reference: input.reference ?? null,
      hours: input.hours ?? null,
      whatsapp: input.whatsapp ?? null,
      maps_url: input.maps_url ?? null,
      photo_url: photoUrl ?? null,
      sort_order: input.sort_order,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Falha ao criar unidade: ${error.message}`);
  return data.id;
}

export async function updateUnit(
  id: string,
  input: UnitInput,
  /** undefined = não mexer na foto atual; string = substituir. */
  photoUrl?: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("units")
    .update({
      name: input.name,
      city: input.city ?? null,
      neighborhood: input.neighborhood ?? null,
      street: input.street ?? null,
      number: input.number ?? null,
      reference: input.reference ?? null,
      hours: input.hours ?? null,
      whatsapp: input.whatsapp ?? null,
      maps_url: input.maps_url ?? null,
      sort_order: input.sort_order,
      ...(photoUrl !== undefined ? { photo_url: photoUrl } : {}),
    })
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar unidade: ${error.message}`);
}

export async function deleteUnit(id: string): Promise<void> {
  const supabase = await createClient();
  // inventory da unidade sai em cascata; o trigger preserva o total do
  // produto quando a última linha some (volta ao modo de estoque único).
  const { error } = await supabase.from("units").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir unidade: ${error.message}`);
}

/**
 * Grava o estoque por unidade de um produto (upsert linha a linha).
 * O trigger do banco recalcula products.stock automaticamente.
 */
export async function setProductInventory(
  productId: string,
  entries: { unitId: string; stock: number }[],
): Promise<void> {
  if (entries.length === 0) return;
  const supabase = await createClient();
  const { error } = await supabase.from("inventory").upsert(
    entries.map((e) => ({
      product_id: productId,
      unit_id: e.unitId,
      stock: e.stock,
    })),
  );

  if (error) throw new Error(`Falha ao salvar estoque: ${error.message}`);
}

/**
 * Liga/desliga o controle de estoque por unidade.
 * LIGAR: semeia o inventário (todo o estoque atual vai para a primeira
 * unidade — o total não muda, só ganha um endereço de partida).
 * DESLIGAR: limpa o inventário; products.stock volta a ser a única fonte
 * (o trigger preserva o total quando as linhas somem).
 */
export async function setTrackStockByUnit(enabled: boolean): Promise<void> {
  const supabase = await createClient();

  // A flag muda PRIMEIRO: desligado, o trigger vira no-op e a limpeza não
  // recalcula totais no meio do caminho (deletar linha a linha com o modo
  // ligado sobrescreveria o estoque com somas parciais).
  const { error: flagError } = await supabase
    .from("store_settings")
    .update({ track_stock_by_unit: enabled })
    .eq("id", 1);
  if (flagError) throw new Error(`Falha ao salvar o modo: ${flagError.message}`);

  if (enabled) {
    const units = await getUnits();
    const first = units[0];
    if (first) {
      const { data: products, error } = await supabase
        .from("products")
        .select("id, stock");
      if (error) throw new Error(`Falha ao ativar o modo: ${error.message}`);
      if (products && products.length > 0) {
        const { error: seedError } = await supabase.from("inventory").upsert(
          products.map((p) => ({
            product_id: p.id,
            unit_id: first.id,
            stock: p.stock,
          })),
        );
        if (seedError)
          throw new Error(`Falha ao ativar o modo: ${seedError.message}`);
      }
    }
  } else {
    // Ação explícita do admin: zera a distribuição (totais preservados,
    // pois o trigger já está desligado pela flag acima).
    const { error } = await supabase
      .from("inventory")
      .delete()
      .gte("stock", 0);
    if (error) throw new Error(`Falha ao desativar o modo: ${error.message}`);
  }
}

/**
 * Semeia o inventário ao criar a PRIMEIRA unidade: todo o estoque atual de
 * cada produto vai para ela (o total não muda; só ganha endereço).
 */
export async function seedInventoryForFirstUnit(unitId: string): Promise<void> {
  const supabase = await createClient();

  // Guarda contra corrida (dois admins criando a "primeira" unidade ao mesmo
  // tempo): só semeia se a unidade recém-criada é de fato a ÚNICA — senão o
  // estoque total dobraria (cada seed soma tudo de novo via trigger).
  const { count, error: countError } = await supabase
    .from("units")
    .select("id", { count: "exact", head: true });
  if (countError) throw new Error(`Falha ao semear estoque: ${countError.message}`);
  if ((count ?? 0) !== 1) return;

  const { data: products, error } = await supabase
    .from("products")
    .select("id, stock");

  if (error) throw new Error(`Falha ao semear estoque: ${error.message}`);
  if (!products || products.length === 0) return;

  const { error: upsertError } = await supabase.from("inventory").upsert(
    products.map((p) => ({
      product_id: p.id,
      unit_id: unitId,
      stock: p.stock,
    })),
  );

  if (upsertError)
    throw new Error(`Falha ao semear estoque: ${upsertError.message}`);
}
