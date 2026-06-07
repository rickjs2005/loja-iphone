import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductInput } from "@/lib/validation/product.schema";
import type { ProductImageRow } from "@/types/database.types";
import type { ProductWithImages } from "./types";
import { demoProducts, findDemoProduct } from "./demo";

/**
 * ÚNICA camada que conversa com o Supabase (tabelas products/product_images).
 * Nenhum componente importa o client diretamente — tudo passa por aqui.
 *
 * Leituras respeitam a RLS: o público vê só produtos ativos; o dono
 * autenticado vê tudo. As funções de escrita só funcionam com sessão
 * autenticada (a RLS bloqueia o resto no banco).
 */

const PRODUCT_WITH_IMAGES =
  "*, images:product_images(id, product_id, url, sort_order)";

function sortImages(images: ProductImageRow[] | null): ProductImageRow[] {
  return [...(images ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}

// ---------------------------------------------------------------------------
// Leitura pública (loja)
// ---------------------------------------------------------------------------

export async function getActiveProducts(): Promise<ProductWithImages[]> {
  if (!isSupabaseConfigured()) return demoProducts;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_IMAGES)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao listar produtos: ${error.message}`);

  return (data ?? []).map((p) => ({ ...p, images: sortImages(p.images) }));
}

export async function getProductById(
  id: string,
): Promise<ProductWithImages | null> {
  if (!isSupabaseConfigured()) return findDemoProduct(id);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_IMAGES)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar produto: ${error.message}`);
  if (!data) return null;

  return { ...data, images: sortImages(data.images) };
}

// ---------------------------------------------------------------------------
// Admin (requer sessão autenticada — garantido por RLS + middleware)
// ---------------------------------------------------------------------------

export async function getAllProducts(): Promise<ProductWithImages[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_IMAGES)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Falha ao listar produtos: ${error.message}`);

  return (data ?? []).map((p) => ({ ...p, images: sortImages(p.images) }));
}

export async function createProduct(input: ProductInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      description: input.description ?? null,
      price_cents: input.price_cents,
      stock: input.stock,
      installments: input.installments,
      is_active: input.is_active,
      sort_order: input.sort_order,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Falha ao criar produto: ${error.message}`);
  return data.id;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      description: input.description ?? null,
      price_cents: input.price_cents,
      stock: input.stock,
      installments: input.installments,
      is_active: input.is_active,
      sort_order: input.sort_order,
    })
    .eq("id", id);

  if (error) throw new Error(`Falha ao atualizar produto: ${error.message}`);
}

export async function setProductActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(`Falha ao alterar status: ${error.message}`);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  // product_images é removido em cascata pelo banco (ON DELETE CASCADE).
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Falha ao excluir produto: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Imagens (linhas em product_images; o arquivo em si vai pelo storage.ts)
// ---------------------------------------------------------------------------

export async function addProductImage(
  productId: string,
  url: string,
  sortOrder: number,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url, sort_order: sortOrder });

  if (error) throw new Error(`Falha ao salvar imagem: ${error.message}`);
}

export async function deleteProductImage(imageId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) throw new Error(`Falha ao remover imagem: ${error.message}`);
}

export async function countProductImages(productId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (error) throw new Error(`Falha ao contar imagens: ${error.message}`);
  return count ?? 0;
}
