# Loja de iPhone — modelo white-label (produtos Apple)

Loja online de iPhones, dark, rápida e personalizável. Pensada como **modelo
de loja Apple white-label**: cada cliente troca **paleta, logo, WhatsApp e
produtos** mexendo em **um único arquivo de config + o logo**. O fechamento da
compra é 100% pelo **WhatsApp** (sem gateway de pagamento).

> ## 🍎 Escopo do produto: modelo de **loja Apple**, não white-label genérico
>
> A personalização cobre **marca, identidade visual, contatos, endereços,
> textos da vitrine e catálogo** — isso é trocado por loja **sem editar
> código** (env vars + admin). Veja a seção de personalização abaixo.
>
> O que é **fixo por design** (assume produtos Apple) e exigiria **código +
> migration** para outro nicho:
>
> - **Categorias** — `iphone / macbook / ipad / watch / airpods / accessory`
>   estão em `src/lib/data/types.ts` (`CATEGORIES`) e na coluna `category`
>   (check no banco). Uma loja de Android/games/etc. precisaria alterar o
>   union type e migrar a constraint.
> - **Marca no SEO** — o JSON-LD de produto declara `brand: "Apple"` para
>   itens que não são acessório (`src/app/(loja)/produtos/[id]/page.tsx`).
> - **Rótulos de navegação** ("iPhones", "MacBooks", "Trocar meu iPhone") e
>   algumas frases assumem o universo Apple.
>
> Para uma loja de **outra marca Apple-cêntrica** (revenda de iPhone/Mac/iPad)
> nada disso precisa mudar — é só configurar. Para um **nicho diferente**,
> trate como fork e ajuste os 3 pontos acima.

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
  whatsapp: "5511900000000",     // só dígitos, com DDI 55
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

### 2. Ajuste os textos em `src/config/copy.ts` (opcional)

Todos os títulos, frases e CTAs da vitrine (hero, "por que comprar",
trade-in, seções da home, benefícios do produto) moram em **um arquivo só**.
Quer um hero diferente para um cliente? Edita uma linha, sem tocar em
componente.

### 3. Troque o logo e o vídeo do hero

Substitua `public/logo.svg` e `public/hero-v4.mp4` (ou aponte `logoUrl` para
outro arquivo em `/public`, ex.: `/logo.png`).

### 4. Cadastre os produtos

No painel admin (`/admin`) ou rodando o `supabase/seed.sql`.

**Pronto.** Nenhum componente precisa ser editado.

> 📋 Roteiro completo de provisionamento (banco novo, admin, deploy,
> conferência final): [`docs/NOVA-LOJA.md`](./docs/NOVA-LOJA.md).

### Revenda (1 código, várias lojas)

Para revender, prefira **não** editar o `theme.config.ts` por loja — defina as
variáveis `NEXT_PUBLIC_STORE_*` e `NEXT_PUBLIC_COLOR_*` (ver `.env.example`) no
deploy de cada loja (ex.: Environment Variables da Vercel). Assim cada loja é o
**mesmo código com env vars diferentes**. O `theme.config.ts` usa essas
variáveis e cai nos defaults quando vazias. O único arquivo por loja é o logo
em `/public` (ou aponte `NEXT_PUBLIC_STORE_LOGO_URL`).

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
  config/theme.config.ts   # 👈 personalização: cores, contatos, redes
  config/copy.ts           # 👈 personalização: textos da vitrine
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
- **Texto de marketing** mora em `config/copy.ts`; componente não tem frase
  de marca hardcoded (rótulos de UI, como "Adicionar ao carrinho", podem).
- **Número de WhatsApp** sempre passa por `lib/phone.ts` (normalização) e
  links saem por `waUrl()`/`<WhatsappCta>` — nunca monte `wa.me` na mão.

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
