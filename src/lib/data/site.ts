import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { SiteSettingsInput } from "@/lib/validation/site.schema";
import type {
  SiteImageRow,
  SiteSection,
  StoreSettingsRow,
} from "@/types/database.types";

/**
 * Camada de dados do CONTEÚDO DA LOJA (endereço/horário + galerias de fotos
 * da loja física e de entrega). Tudo gerenciado pelo dono no admin.
 */

// Conteúdo de exemplo para o MODO DEMO (sem Supabase configurado).
const DEMO_SETTINGS: StoreSettingsRow = {
  id: 1,
  address: "Av. Exemplo, 123 — Centro, Sua Cidade/UF",
  hours: "Seg a Sex, 9h às 18h · Sáb, 9h às 13h",
  maps_url: "",
  payment_methods: "Pix, cartão em até 12x e dinheiro",
  updated_at: "2026-01-01T00:00:00.000Z",
};

// React.cache deduplica por request: várias seções/layout podem pedir as
// mesmas configurações sem repetir a query no Supabase.
export const getStoreSettings = cache(async (): Promise<StoreSettingsRow> => {
  if (!isSupabaseConfigured()) return DEMO_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar config: ${error.message}`);
  return (
    data ?? {
      id: 1,
      address: null,
      hours: null,
      maps_url: null,
      payment_methods: null,
      updated_at: "",
    }
  );
});

export const getSiteImages = cache(
  async (section: SiteSection): Promise<SiteImageRow[]> => {
    if (!isSupabaseConfigured()) return [];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .eq("section", section)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(`Falha ao carregar imagens: ${error.message}`);
    return data ?? [];
  },
);

// --------------------------------------------------------------------------
// Escrita (admin autenticado)
// --------------------------------------------------------------------------

export async function updateStoreSettings(
  input: SiteSettingsInput,
): Promise<void> {
  const supabase = await createClient();
  // upsert: cria a linha id=1 se ainda não existir (UPDATE puro falharia
  // em silêncio num banco recém-provisionado).
  const { error } = await supabase.from("store_settings").upsert({
    id: 1,
    address: input.address ?? null,
    hours: input.hours ?? null,
    maps_url: input.maps_url ?? null,
    payment_methods: input.payment_methods ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(`Falha ao salvar config: ${error.message}`);
}

export async function addSiteImage(
  section: SiteSection,
  url: string,
  sortOrder: number,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_images")
    .insert({ section, url, sort_order: sortOrder });

  if (error) throw new Error(`Falha ao salvar imagem: ${error.message}`);
}

export async function deleteSiteImage(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("site_images").delete().eq("id", id);

  if (error) throw new Error(`Falha ao remover imagem: ${error.message}`);
}

/**
 * Próxima posição da galeria da seção: max(sort_order) + 1 (contar linhas
 * colide com posições ocupadas após uma deleção).
 *
 * NÃO usar React.cache aqui: roda dentro de mutações (upload de várias
 * imagens no mesmo request precisa de valores frescos a cada chamada).
 */
export async function getNextSiteImageOrder(
  section: SiteSection,
): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("sort_order")
    .eq("section", section)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Falha ao buscar ordem das imagens: ${error.message}`);
  return (data?.sort_order ?? -1) + 1;
}
