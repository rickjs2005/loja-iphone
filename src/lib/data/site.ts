import "server-only";
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
  updated_at: "2026-01-01T00:00:00.000Z",
};

export async function getStoreSettings(): Promise<StoreSettingsRow> {
  if (!isSupabaseConfigured()) return DEMO_SETTINGS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar config: ${error.message}`);
  return (
    data ?? { id: 1, address: null, hours: null, maps_url: null, updated_at: "" }
  );
}

export async function getSiteImages(
  section: SiteSection,
): Promise<SiteImageRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_images")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Falha ao carregar imagens: ${error.message}`);
  return data ?? [];
}

// --------------------------------------------------------------------------
// Escrita (admin autenticado)
// --------------------------------------------------------------------------

export async function updateStoreSettings(
  input: SiteSettingsInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("store_settings")
    .update({
      address: input.address ?? null,
      hours: input.hours ?? null,
      maps_url: input.maps_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

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

export async function countSiteImages(section: SiteSection): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("site_images")
    .select("id", { count: "exact", head: true })
    .eq("section", section);

  if (error) throw new Error(`Falha ao contar imagens: ${error.message}`);
  return count ?? 0;
}
