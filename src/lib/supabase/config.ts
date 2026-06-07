/**
 * Indica se há credenciais do Supabase configuradas.
 *
 * Quando não há (ex.: clone recém-baixado, sem .env.local), a loja entra em
 * MODO DEMO: as leituras públicas usam produtos de exemplo, para você
 * pré-visualizar o visual sem precisar de backend. O admin exige Supabase real.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
