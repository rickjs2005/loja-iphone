# Loja de iPhone — White-label

Loja online de iPhones, dark, rápida e personalizável. Pensada como **produto
demo white-label**: cada cliente troca **paleta, logo, WhatsApp e produtos**
mexendo em **um único arquivo de config + o logo**. O fechamento da compra é
100% pelo **WhatsApp** (sem gateway de pagamento).

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (tema via CSS variables)
- **Framer Motion** (hero animado, micro-interações)
- **Supabase**: Auth (dono), Postgres (produtos/estoque), Storage (fotos)
- **Zustand** (carrinho) + **Zod** (validação)

---

## 🎨 Personalizar para um novo cliente (< 5 min)

### 1. Edite `src/config/theme.config.ts`

É a **fonte única** de personalização:

```ts
export const storeConfig = {
  name: "Nome da Loja",
  description: "Frase curta da loja",
  logoUrl: "/logo.svg",          // arquivo em /public
  whatsapp: "5533999999999",     // só dígitos, com DDI 55
  social: { instagram: "...", facebook: "", tiktok: "" },
  colors: {                       // viram CSS variables e o Tailwind consome
    bg: "#0A0A0B",
    surface: "#141416",
    primary: "#3B82F6",
    accent: "#A855F7",
    text: "#FAFAFA",
    muted: "#A1A1AA",
  },
};
```

### 2. Troque o logo

Substitua `public/logo.svg` (ou aponte `logoUrl` para outro arquivo em
`/public`, ex.: `/logo.png`).

### 3. Cadastre os produtos

No painel admin (`/admin`) ou rodando o `supabase/seed.sql`.

**Pronto.** Nenhum componente precisa ser editado.

> Como funciona: `theme.config.ts` → `<ThemeInjector>` injeta as cores como
> CSS variables (`--store-*`) no `:root` → o Tailwind (em `globals.css`, via
> `@theme inline`) gera os utilitários `bg-bg`, `bg-surface`, `text-primary`,
> etc. Os componentes só usam esses utilitários.

---

## 🚀 Setup do zero

### 1. Dependências

```bash
npm install
```

### 2. Crie o projeto no Supabase

- Crie um projeto em [supabase.com](https://supabase.com).
- Em **Project Settings → API**, copie a **Project URL** e a **anon/publishable key**.

### 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

> ⚠️ Este projeto **não usa** a `service_role`. Não a coloque em lugar nenhum.

### 4. Banco de dados

Rode a migration (cria tabelas, RLS, bucket e policies). Opções:

**a) SQL Editor (mais simples):** cole o conteúdo de
`supabase/migrations/20260607000001_init.sql` no SQL Editor do dashboard e
execute. Para dados de exemplo, rode também `supabase/seed.sql`.

**b) Supabase CLI:**

```bash
supabase link --project-ref <REF>
supabase db push
# (opcional) dados de exemplo:
#   psql "$DATABASE_URL" -f supabase/seed.sql
```

### 5. Crie o usuário do dono

No dashboard: **Authentication → Users → Add user** (e-mail + senha).
**Desative os signups públicos** em Authentication → Settings, para que só o
dono tenha acesso ao admin.

### 6. Rode

```bash
npm run dev
```

- Loja: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

---

## 📁 Estrutura

```
src/
  app/
    (loja)/                # rotas públicas (home, produtos, carrinho)
    admin/                 # login + CRUD protegido
  components/              # componentes reutilizáveis (sem queries)
  config/theme.config.ts   # 👈 personalização white-label
  lib/
    data/                  # ÚNICA camada que fala com o Supabase
    supabase/              # clients (server, client, middleware)
    validation/            # schemas Zod
    auth/                  # helpers de sessão + rate limit
    cart/                  # store do carrinho (Zustand)
supabase/
  migrations/              # schema + RLS + Storage
  seed.sql                 # produtos de exemplo
```

## Convenções

- **Preços em centavos** (inteiro) no banco; `formatCents()` formata só na UI.
- **Nenhum componente** importa o Supabase direto — tudo passa por `lib/data/`.
- **Mutações** só via Server Actions com validação Zod.

## Regenerar os types do banco

Com o projeto Supabase ativo:

```bash
supabase gen types typescript --project-id <REF> > src/types/database.types.ts
```

## Segurança

Veja [`SECURITY.md`](./SECURITY.md) para a postura completa (RLS, Storage,
cookies httpOnly, rate limit, headers).

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servir o build
npm run lint    # eslint
```
