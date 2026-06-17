import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Client do Supabase para LEITURAS PÚBLICAS da loja (anon, SEM cookies).
 *
 * Por que existe: o client de ./server chama `cookies()`, e qualquer acesso a
 * cookies força o Next a renderizar a rota dinamicamente (ignora o ISR). As
 * leituras públicas (catálogo, config, galerias, unidades) não dependem de
 * sessão — a RLS libera o anon — então usar um client sem cookies permite que
 * a home e as páginas públicas sejam CACHEADAS (servidas do CDN).
 *
 * Use APENAS em leituras de dados públicos. Escrita e qualquer leitura que
 * dependa da sessão do dono continuam em createClient() de ./server.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
