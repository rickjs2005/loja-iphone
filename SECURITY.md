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
- As **Server Actions** também chamam `requireUser()` (defesa em profundidade,
  além da RLS no banco).

## Banco de dados (RLS)

RLS habilitada em `products` e `product_images` (ver `supabase/migrations`):

- `SELECT` público: anon vê apenas produtos **ativos** (e imagens de produtos
  ativos). O dono autenticado vê tudo.
- `INSERT` / `UPDATE` / `DELETE`: **somente autenticado**. As policies de UPDATE
  têm `USING` **e** `WITH CHECK`.
- `GRANT`s explícitos para `anon`/`authenticated` (exposição correta na Data API).

## Storage

- Bucket `product-images` com **leitura pública** e **escrita só autenticada**.
- Policies de INSERT + SELECT + UPDATE + DELETE (upsert exige as três primeiras).

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

- Login limitado a **5 tentativas / 15 min por IP** (`src/lib/auth/rate-limit.ts`).
- É um limitador **em memória** (por instância). Para garantias fortes em
  produção serverless, troque por um store compartilhado (ex.: Upstash Redis).

## Headers HTTP

`next.config.ts` envia: `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, e desabilita o header `X-Powered-By`.

## Antes de ir para produção

- [ ] Criar o usuário do dono no Supabase Auth e **desabilitar signups públicos**
      (Dashboard → Authentication → Providers/Settings).
- [ ] Conferir que **anonymous sign-ins** está **desligado**.
- [ ] Rodar os advisors do Supabase (`supabase db advisors` ou MCP `get_advisors`).
- [ ] Confirmar que `.env.local` tem apenas `NEXT_PUBLIC_*` (sem service_role).
