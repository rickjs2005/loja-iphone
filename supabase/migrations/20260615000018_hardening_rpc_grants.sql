-- ============================================================================
--  HARDENING — superfície de RPC (Supabase advisor 0028/0029)
--  Tira do PostgREST funções SECURITY DEFINER que não precisam ser chamáveis
--  por anon. NÃO mexe em login_rate_check / login_rate_fail: o app as chama
--  ANTES do login (role anon), e sem elas o rate limit cairia para o fallback
--  em memória — justamente o que a tabela login_attempts veio resolver. O aviso
--  do advisor nessas duas é esperado e aceito (check é read-only; fail só
--  incrementa a janela do próprio chamador).
-- ============================================================================

-- Trigger function: dispara sozinha como trigger (sob o dono da tabela),
-- independente de GRANT. Não há motivo para ficar exposta em /rest/v1/rpc.
revoke all on function public.sync_product_stock() from public, anon, authenticated;

-- is_admin(): só o app autenticado precisa (requireAdmin + policies de escrita,
-- todas `to authenticated`). A policy pública de SELECT não usa is_admin, então
-- anon nunca a chama. Mantém o EXECUTE para authenticated.
revoke execute on function public.is_admin() from public, anon;

-- login_rate_reset(): só roda no sucesso do login (sessão já autenticada) e tem
-- fallback gracioso (se falhar, a janela expira sozinha em 15 min). Remover de
-- anon fecha o vetor de um atacante zerar o próprio contador entre tentativas.
revoke execute on function public.login_rate_reset(text) from public, anon;
