/**
 * Indica se há credenciais do Supabase configuradas.
 *
 * Quando não há (ex.: clone recém-baixado, sem .env.local), a loja entra em
 * MODO DEMO: as leituras públicas usam produtos de exemplo, para você
 * pré-visualizar o visual sem precisar de backend. O admin exige Supabase real.
 */

// Em produção, cair no modo demo significa env vars faltando no deploy — a
// loja exibiria produtos falsos em vez de acusar o erro. Alerta UMA vez por
// instância para o problema aparecer nos logs da plataforma.
let demoAlertado = false;

export function isSupabaseConfigured(): boolean {
  const ok = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  if (!ok && !demoAlertado && process.env.NODE_ENV === "production") {
    demoAlertado = true;
    console.error(
      "[loja] ERRO DE CONFIGURACAO: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY ausentes em producao — a loja esta exibindo produtos DEMO em vez dos reais.",
    );
  }
  return ok;
}
