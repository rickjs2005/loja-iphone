-- ============================================================================
--  CONTEÚDO DA LOJA (gerenciado pelo dono no admin)
--  - store_settings: endereço, horário, link do mapa (linha única)
--  - site_images: galerias "loja física" e "entrega"
--  Mesmo modelo de acesso: leitura pública, escrita só autenticado.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- store_settings (linha única, id sempre = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.store_settings (
  id              integer primary key default 1 check (id = 1),
  address         text,
  hours           text,
  maps_url        text,
  payment_methods text,
  updated_at      timestamptz not null default now()
);

-- Garante a existência da linha única.
insert into public.store_settings (id) values (1)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- site_images (galerias por seção: 'loja' | 'entrega')
-- ---------------------------------------------------------------------------
create table if not exists public.site_images (
  id         uuid primary key default gen_random_uuid(),
  section    text not null check (section in ('loja', 'entrega')),
  url        text not null,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists site_images_section_idx
  on public.site_images (section, sort_order);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant select on public.store_settings, public.site_images to anon, authenticated;
grant insert, update on public.store_settings to authenticated;
grant insert, delete on public.site_images to authenticated;

-- ---------------------------------------------------------------------------
-- RLS — store_settings
-- ---------------------------------------------------------------------------
alter table public.store_settings enable row level security;

create policy "config da loja é pública"
  on public.store_settings for select
  to anon, authenticated
  using (true);

create policy "autenticado insere config"
  on public.store_settings for insert
  to authenticated
  with check (true);

create policy "autenticado atualiza config"
  on public.store_settings for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- RLS — site_images
-- ---------------------------------------------------------------------------
alter table public.site_images enable row level security;

create policy "imagens do site são públicas"
  on public.site_images for select
  to anon, authenticated
  using (true);

create policy "autenticado insere imagens do site"
  on public.site_images for insert
  to authenticated
  with check (true);

create policy "autenticado remove imagens do site"
  on public.site_images for delete
  to authenticated
  using (true);
