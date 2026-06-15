# Postura de Segurança

Resumo das proteções implementadas nesta loja. Use como checklist ao entregar
para um cliente.

## Autenticação e sessão

- **Auth server-side** com `@supabase/ssr`; a sessão vive em **cookies httpOnly**
  (o navegador não tem acesso via JavaScript).
- Toda checagem de autorização usa **`getUser()`** (revalida o token no servidor
  do Supabase), nunca `getSession()` (que só lê o cookie e pode ser forjado).
- **Middleware** (`src/middleware.ts`) protege `/admin/*`: sem sessão →
  redireciona para `/admin/login`. Já logado em `/admin/login` →
  redireciona para o painel.
- As **Server Actions** também chamam `requireAdmin()` (defesa em profundidade,
  além da RLS no banco): valida a sessão com `getUser()` **e** confirma que o
  usuário está na allow-list de admins via RPC `is_admin()`.

## Banco de dados (RLS)

RLS habilitada em **todas** as tabelas de `public` (ver `supabase/migrations`).
Verificado no projeto de produção em 2026-06-15.

- **Allow-list de admins** (`public.admins`): escrever no catálogo/conteúdo exige
  estar nessa tabela. A função `public.is_admin()` (SECURITY DEFINER) checa o
  `auth.uid()` da sessão. Um usuário `authenticated` que NÃO esteja na allow-list
  (ex.: signup indesejado) não consegue escrever nada. Adicionar admin é manual,
  via SQL/dashboard.
- `SELECT` público: anon vê apenas produtos **ativos** (e imagens de produtos
  ativos). O admin vê tudo.
- `INSERT` / `UPDATE` / `DELETE` em `products`, `product_images`, `store_settings`,
  `site_images`, `units`, `inventory`: exigem `is_admin()`. As policies de UPDATE
  têm `USING` **e** `WITH CHECK`.
- `admins` e `login_attempts`: RLS habilitada **sem nenhuma policy** (deny-all) —
  inacessíveis pela Data API; só funções SECURITY DEFINER as tocam. O advisor
  lista isso como INFO; é proposital.

## Storage

- Bucket `product-images` com **leitura pública** e **escrita só de admin**
  (policies de INSERT/SELECT/UPDATE/DELETE com `is_admin()`; upsert exige as três
  primeiras). RLS forçada em `storage.objects`.

## Mutações

- **100% via Server Actions** (`'use server'`) → proteção **CSRF/origin nativa**
  do Next.js. Não há token CSRF manual (não é necessário).
- **Validação Zod** em toda action antes de tocar o banco (`src/lib/validation`).
- Upload de imagem valida **tipo** (JPG/PNG/WebP) e **tamanho** (≤ 5 MB).
- O `redirect` pós-login só aceita caminhos internos `/admin` (evita open
  redirect).

## Chaves e segredos

- **A `service_role` NÃO é usada em lugar nenhum.** Todas as operações do admin
  rodam com a sessão autenticada do dono + RLS.
- No client só existe a chave pública (`NEXT_PUBLIC_SUPABASE_ANON_KEY`), segura
  por design enquanto a RLS estiver ativa.
- `.env.local` está no `.gitignore`.

## Rate limiting

- Login (e pedido de reset de senha) limitado a **5 tentativas / 15 min por IP**
  (`src/lib/auth/rate-limit.ts`).
- **Persistido no Postgres** (tabela `login_attempts` via RPC SECURITY DEFINER),
  então sobrevive a cold starts em serverless. Se o RPC ficar indisponível, cai
  num **fallback em memória** (por instância).
- **LGPD**: o IP nunca vai ao banco em claro — grava-se um `SHA-256(salt + IP)`.

## Funções e RPC (hardening)

- `login_rate_check` / `login_rate_fail` ficam acessíveis ao `anon` **de
  propósito**: o app as chama antes do login (role anon). São seguras (check é
  read-only; fail só incrementa a janela do próprio chamador). O aviso do advisor
  do Supabase nessas duas é **esperado e aceito**.
- `login_rate_reset`, `is_admin` e a trigger `sync_product_stock` tiveram o
  `EXECUTE` do `anon` revogado (migration `..._hardening_rpc_grants.sql`):
  `is_admin`/`login_rate_reset` ficam só para `authenticated`; `sync_product_stock`
  sai da Data API (dispara como trigger, não precisa de GRANT).

## Headers HTTP

`next.config.ts` envia: `Content-Security-Policy`, `Strict-Transport-Security`
(HSTS), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, e desabilita o header `X-Powered-By`.

## Antes de ir para produção

- [ ] Criar o usuário do dono no Supabase Auth e **desabilitar signups públicos**
      (Dashboard → Authentication → Providers/Settings).
- [ ] Conferir que **anonymous sign-ins** está **desligado**.
- [ ] Habilitar **Leaked Password Protection** (Auth → Password Security) —
      checa a senha contra o HaveIBeenPwned. Recomendado: ativar **MFA** na conta
      do dono.
- [ ] Confirmar que **só o `user_id` do dono está em `public.admins`**.
- [ ] Rodar os advisors do Supabase (`supabase db advisors` ou MCP `get_advisors`).
- [ ] Confirmar que `.env.local` tem apenas `NEXT_PUBLIC_*` (sem service_role).
