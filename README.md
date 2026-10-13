**English** | [Português](README.pt-BR.md)

# iPhone Store — white-label template (Apple products)

A dark, fast, customizable online store for iPhones, with an admin panel. Built
as a **white-label Apple-reseller template**: each client swaps **palette, logo,
WhatsApp number and products** through environment variables (or a single
config file) and the admin panel. Checkout happens entirely over **WhatsApp**
(no payment gateway). The UI is in Brazilian Portuguese.

> **Type:** commercial demo / white-label base · **Demo:** <https://loja-de-iphone-demo.vercel.app>
>
> Independent project. **Not affiliated with, sponsored or endorsed by Apple
> Inc.** "Apple", "iPhone", "iPad", "MacBook", "Apple Watch" and "AirPods" are
> trademarks of Apple Inc., used only to describe products sold by resellers.
> The demo store's name, logo and contacts are fictional.

![Demo store home page](docs/screenshots/home.jpg)

## Features

- **Storefront**: video hero, trust band, product-line cards (iPhone, MacBook,
  iPad, accessories), per-line catalog with price, installments, battery
  health and condition; accessories section with filters.
- **Product page** with gallery/lightbox, specs, per-store availability and
  related products.
- **Cart** (Zustand, persisted in the browser) with **"Checkout on
  WhatsApp"**: opens the chat with a prefilled message (items and total).
- **Trade-in**: form that builds the trade-in message for WhatsApp.
- **Editable sections**: "Our store"/locations (address, hours, map link,
  per-location WhatsApp), completed deliveries, Instagram.
- **Admin panel** (`/admin`): login, password recovery, product CRUD with
  photos, activate/deactivate, store info, locations and site images.
- **SEO**: product JSON-LD, `sitemap.xml`, `robots.txt`, Open Graph image.
- **Demo mode**: without Supabase configured, the store runs with sample products.

## Scope: an **Apple store** template, not a generic white-label

Customization covers **brand, visual identity, contacts, addresses, storefront
copy and catalog** — changed per store **without editing code** (env vars +
admin).

**Fixed by design** (assumes Apple products); another niche would need **code +
a migration**:

- **Categories** — `iphone / macbook / ipad / watch / airpods / accessory` in
  `src/lib/data/types.ts` (`CATEGORIES`) and the `category` column (DB check).
- **SEO brand** — product JSON-LD declares `brand: "Apple"` for non-accessory
  items (`src/app/(loja)/produtos/[id]/page.tsx`).
- **Navigation labels** ("iPhones", "MacBooks", "Trocar meu iPhone") and some
  copy assume the Apple universe.

For an Apple-centric reseller nothing changes — just configure. For a different
niche, treat it as a fork and adjust the three points above.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + React 19
- **Tailwind CSS v4** (theme via CSS variables)
- **Framer Motion** (animated hero, micro-interactions)
- **Supabase** (`@supabase/ssr`): Auth (owner), Postgres (products/stock/content), Storage (photos)
- **Zustand** (cart) + **Zod** (validation)

## Prerequisites

- Node.js 20+ (tested with Node 22) and npm
- A Supabase project (optional to see demo mode)

## Setup

### 1. Dependencies

```bash
npm ci
```

### 2. Supabase project

Create a project at [supabase.com](https://supabase.com). Under **Project
Settings → API**, copy the **Project URL** and the **anon/publishable key**.

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill it in (the file lists and
documents every variable):

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_STORE_NAME=
NEXT_PUBLIC_STORE_WHATSAPP=
```

> This project **does not use** the `service_role` key. Never put it anywhere.
> Without the Supabase variables the store runs in **demo mode**.

### 4. Database

Apply **all** migrations in `supabase/migrations/` (tables, RLS, bucket,
policies, rate limit, stock trigger):

```bash
supabase link --project-ref <REF>
supabase db push
```

Without the CLI, run the files in the SQL Editor **in order**. For sample data,
also run `supabase/seed.sql`.

### 5. Owner account

Create the user under **Authentication → Users → Add user**, add it to the
`public.admins` allow-list and **disable public sign-ups**. Step by step (in
Portuguese) in [`docs/NOVA-LOJA.md`](docs/NOVA-LOJA.md).

### 6. Run

```bash
npm run dev
```

- Store: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

## Customizing for a new client

1. **`src/config/theme.config.ts`** — single source for name, description,
   logo, WhatsApp, social links and colors. Values come from the
   `NEXT_PUBLIC_STORE_*` / `NEXT_PUBLIC_COLOR_*` variables and fall back to the
   "iDemo" store defaults when empty.
2. **`src/config/copy.ts`** (optional) — storefront headlines, copy and CTAs.
3. **Media in `/public`** — `logo.svg` (or `NEXT_PUBLIC_STORE_LOGO_URL`),
   `hero-v5.mp4`, `hero-poster.jpg`, `tradein-v2.webp`.
4. **Products and content** — via the `/admin` panel or `supabase/seed.sql`.

**Reselling (one codebase, many stores):** avoid editing `theme.config.ts` per
store — set each store's variables in its deployment. Golden rule:
**1 client = 1 Supabase project + 1 deployment**. Full checklist:
[`docs/NOVA-LOJA.md`](docs/NOVA-LOJA.md).

> How it works: `theme.config.ts` → `<ThemeInjector>` injects colors as CSS
> variables (`--store-*`) on `:root` → Tailwind (`@theme inline` in
> `globals.css`) generates `bg-bg`, `bg-surface`, `text-primary`, etc.

## Structure

```
src/
  app/
    (loja)/                # public routes (home, products, cart)
    admin/                 # login, password recovery and protected CRUD
  components/              # reusable components (no queries)
  config/theme.config.ts   # customization: colors, contacts, social
  config/copy.ts           # customization: storefront copy
  lib/
    data/                  # the ONLY layer that talks to Supabase
    supabase/              # clients (server, client, middleware)
    validation/            # Zod schemas
    auth/                  # session helpers + rate limit
    cart/                  # cart store (Zustand)
supabase/
  migrations/              # schema + RLS + Storage
  seed.sql                 # sample products
docs/                      # new-store checklist, security posture, screenshots
```

## Conventions

- **Prices in cents** (integer) in the DB; `formatCents()` formats only in the UI.
- **No component** imports Supabase directly — everything goes through `lib/data/`.
- **Mutations** only via Server Actions with Zod validation.
- **Marketing copy** lives in `config/copy.ts`.
- **WhatsApp numbers** are always normalized by `lib/phone.ts`; links come from
  `waUrl()`/`<WhatsappCta>` — never build `wa.me` URLs by hand.

Regenerate the database types:

```bash
supabase gen types typescript --project-id <REF> > src/types/database.types.ts
```

## Scripts

```bash
npm run dev     # development
npm run build   # production build
npm run start   # serve the build
npm run lint    # eslint
npx tsc --noEmit
```

## Limitations

- No payment gateway: purchases are closed over WhatsApp.
- No automated tests; CI runs lint, typecheck and build.
- Domain fixed on Apple products (see "Scope").
- No multi-tenant isolation in the database: each store needs its own Supabase project.

## Media

Videos and images in `/public` and the demo store logo: origin not documented.
Replace them with the client's material before publishing a real store.

## Further documentation (Portuguese)

- [`docs/NOVA-LOJA.md`](docs/NOVA-LOJA.md) — checklist to launch a new store.
- [`DESCRICAO_PRODUTO.md`](DESCRICAO_PRODUTO.md) — product description and sales pitch.

## Security

See [SECURITY.md](SECURITY.md) to report vulnerabilities and
[docs/SECURITY-POSTURE.md](docs/SECURITY-POSTURE.md) for the full posture
(RLS, Storage, httpOnly cookies, rate limit, headers).

## License

No license has been chosen yet; all rights reserved by the author.
