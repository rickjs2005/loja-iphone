import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProductInput } from "@/lib/validation/product.schema";
import type { ProductImageRow } from "@/types/database.types";
import type { ProductWithImages } from "./types";
import { demoProducts, findDemoProduct } from "./demo";

/** Normaliza os campos específicos de categoria (zera o que não se aplica). */
function categoryFields(input: ProductInput) {
  const isAcc = input.category === "accessory";
  return {
    category: input.category,
    accessory_category: isAcc ? (input.accessory_category ?? null) : null,
    battery_health: isAcc ? null : (input.battery_health ?? null),
    condition: isAcc ? null : (input.condition ?? null),
  };
}

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

// React.cache deduplica por request: layout e página chamam a mesma função
// sem disparar duas queries idênticas (idem generateMetadata + página).
export const getActiveProducts = cache(
  async (): Promise<ProductWithImages[]> => {
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
  },
);

export const getProductById = cache(
  async (id: string): Promise<ProductWithImages | null> => {
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
  },
);

/**
 * Upsell do carrinho: só os acessórios em estoque, já limitados no banco.
 * (Antes o layout público pagava a query do catálogo INTEIRO por request.)
 */
export const getUpsellAccessories = cache(
  async (limit = 6): Promise<ProductWithImages[]> => {
    if (!isSupabaseConfigured()) {
      return demoProducts
        .filter((p) => p.category === "accessory" && p.stock > 0)
        .slice(0, limit);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_IMAGES)
      .eq("is_active", true)
      .eq("category", "accessory")
      .gt("stock", 0)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) throw new Error(`Falha ao listar acessórios: ${error.message}`);
    return (data ?? []).map((p) => ({ ...p, images: sortImages(p.images) }));
  },
);

/** Sitemap: só id + data — sem pagar o join de imagens do catálogo inteiro. */
export const getSitemapProducts = cache(
  async (): Promise<{ id: string; created_at: string }[]> => {
    if (!isSupabaseConfigured()) {
      return demoProducts.map(({ id, created_at }) => ({ id, created_at }));
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, created_at")
      .eq("is_active", true);

    if (error) throw new Error(`Falha ao montar sitemap: ${error.message}`);
    return data ?? [];
  },
);

/** Estado atual (preço/estoque/ativo) de itens do carrinho — revalidação. */
export async function getProductsState(
  ids: string[],
): Promise<
  { id: string; price_cents: number; stock: number; is_active: boolean }[]
> {
  if (ids.length === 0) return [];
  if (!isSupabaseConfigured()) {
    return demoProducts
      .filter((p) => ids.includes(p.id))
      .map(({ id, price_cents, stock, is_active }) => ({
        id,
        price_cents,
        stock,
        is_active,
      }));
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, price_cents, stock, is_active")
    .in("id", ids);

  if (error) throw new Error(`Falha ao conferir itens: ${error.message}`);
  return data ?? [];
}

/**
 * Relacionados da PDP: mesma categoria, exceto o próprio produto, já
 * limitados no banco (antes a página pagava o catálogo inteiro para
 * filtrar 3 itens em memória).
 */
export const getRelatedProducts = cache(
  async (
    category: string,
    excludeId: string,
    limit = 3,
  ): Promise<ProductWithImages[]> => {
    if (!isSupabaseConfigured()) {
      return demoProducts
        .filter((p) => p.category === category && p.id !== excludeId)
        .slice(0, limit);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_IMAGES)
      .eq("is_active", true)
      .eq("category", category)
      .neq("id", excludeId)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) throw new Error(`Falha ao listar relacionados: ${error.message}`);
    return (data ?? []).map((p) => ({ ...p, images: sortImages(p.images) }));
  },
);

// ---------------------------------------------------------------------------
// Admin (requer sessão autenticada — garantido por RLS + middleware)
// ---------------------------------------------------------------------------

export const getAllProducts = cache(
  async (): Promise<ProductWithImages[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_WITH_IMAGES)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Falha ao listar produtos: ${error.message}`);

    return (data ?? []).map((p) => ({ ...p, images: sortImages(p.images) }));
  },
);

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
      ...categoryFields(input),
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
      ...categoryFields(input),
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

/**
 * Próxima posição na galeria: max(sort_order) + 1. Contar linhas não serve —
 * após uma deleção o count colide com posições já ocupadas.
 *
 * NÃO usar React.cache aqui: roda dentro de mutações (upload de várias
 * imagens no mesmo request precisa de valores frescos a cada chamada).
 */
export async function getNextImageOrder(productId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar ordem das imagens: ${error.message}`);
  return (data?.sort_order ?? -1) + 1;
}
