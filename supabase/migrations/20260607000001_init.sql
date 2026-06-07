-- ============================================================================
--  LOJA DE IPHONE — Schema inicial
--  Tabelas: products, product_images
--  Modelo de acesso: leitura pública (produtos ativos), escrita só autenticado.
--  Preços SEMPRE em centavos (inteiro). Formatação para R$ acontece só na UI.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price_cents  integer not null check (price_cents >= 0),
  stock        integer not null default 0 check (stock >= 0),
  installments integer not null default 12 check (installments between 1 and 24),
  is_active    boolean not null default true,
  sort_order   integer default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  sort_order integer default 0
);

create index if not exists products_active_sort_idx
  on public.products (is_active, sort_order, created_at desc);

create index if not exists product_images_product_idx
  on public.product_images (product_id, sort_order);

-- ---------------------------------------------------------------------------
-- Grants (necessários para a Data API expor as tabelas aos roles do Supabase)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.products, public.product_images to anon, authenticated;
grant insert, update, delete on public.products, public.product_images to authenticated;

-- ---------------------------------------------------------------------------
-- RLS — products
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

-- Público (anon + authenticated) vê apenas produtos ativos.
create policy "produtos ativos sao publicos"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

-- O dono autenticado enxerga tudo (inclusive inativos) no admin.
create policy "autenticado le todos os produtos"
  on public.products for select
  to authenticated
  using (true);

-- Escrita: somente autenticado (modelo de dono único).
create policy "autenticado insere produtos"
  on public.products for insert
  to authenticated
  with check (true);

create policy "autenticado atualiza produtos"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "autenticado remove produtos"
  on public.products for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- RLS — product_images
-- ---------------------------------------------------------------------------
alter table public.product_images enable row level security;

-- Público vê imagens cujos produtos estão ativos.
create policy "imagens de produtos ativos sao publicas"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active = true
    )
  );

-- O dono autenticado enxerga todas as imagens no admin.
create policy "autenticado le todas as imagens"
  on public.product_images for select
  to authenticated
  using (true);

create policy "autenticado insere imagens"
  on public.product_images for insert
  to authenticated
  with check (true);

create policy "autenticado atualiza imagens"
  on public.product_images for update
  to authenticated
  using (true)
  with check (true);

create policy "autenticado remove imagens"
  on public.product_images for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Storage — bucket público de imagens dos produtos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Leitura pública das imagens.
create policy "imagens: leitura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Upload, substituição (upsert) e remoção: somente autenticado.
-- Obs.: upsert exige INSERT + SELECT + UPDATE (regra do Supabase Storage).
create policy "imagens: upload autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "imagens: update autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

create policy "imagens: delete autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
