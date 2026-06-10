-- ============================================================================
--  SEGURANÇA — Allow-list de admins
--  Antes: qualquer usuário `authenticated` tinha escrita total (se signups
--  estiverem habilitados no projeto, qualquer pessoa vira "dono" da loja).
--  Agora: escrita (e leitura administrativa) exigem presença na tabela
--  public.admins. Para adicionar um novo admin, insira o user_id via
--  dashboard/SQL: insert into public.admins (user_id) values ('<uuid>');
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tabela de admins (sem policies: inacessível via Data API; só via dashboard)
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Usuários já existentes são o(s) dono(s) da loja: entram na allow-list.
insert into public.admins (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Helper: o usuário da sessão é admin?
-- SECURITY DEFINER para ler public.admins mesmo sem policies na tabela.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- products: escrita e leitura administrativa só para admins
-- (a policy pública "produtos ativos sao publicos" permanece intacta)
-- ---------------------------------------------------------------------------
drop policy if exists "autenticado le todos os produtos" on public.products;
create policy "admin le todos os produtos"
  on public.products for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "autenticado insere produtos" on public.products;
create policy "admin insere produtos"
  on public.products for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "autenticado atualiza produtos" on public.products;
create policy "admin atualiza produtos"
  on public.products for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "autenticado remove produtos" on public.products;
create policy "admin remove produtos"
  on public.products for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------------
drop policy if exists "autenticado le todas as imagens" on public.product_images;
create policy "admin le todas as imagens"
  on public.product_images for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "autenticado insere imagens" on public.product_images;
create policy "admin insere imagens"
  on public.product_images for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "autenticado atualiza imagens" on public.product_images;
create policy "admin atualiza imagens"
  on public.product_images for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "autenticado remove imagens" on public.product_images;
create policy "admin remove imagens"
  on public.product_images for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- store_settings / site_images (conteúdo da loja)
-- ---------------------------------------------------------------------------
drop policy if exists "autenticado insere config" on public.store_settings;
create policy "admin insere config"
  on public.store_settings for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "autenticado atualiza config" on public.store_settings;
create policy "admin atualiza config"
  on public.store_settings for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "autenticado insere imagens do site" on public.site_images;
create policy "admin insere imagens do site"
  on public.site_images for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "autenticado remove imagens do site" on public.site_images;
create policy "admin remove imagens do site"
  on public.site_images for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Storage (bucket product-images)
-- ---------------------------------------------------------------------------
drop policy if exists "imagens: select autenticado" on storage.objects;
create policy "imagens: select admin"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "imagens: upload autenticado" on storage.objects;
create policy "imagens: upload admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "imagens: update autenticado" on storage.objects;
create policy "imagens: update admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()))
  with check (bucket_id = 'product-images' and (select public.is_admin()));

drop policy if exists "imagens: delete autenticado" on storage.objects;
create policy "imagens: delete admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and (select public.is_admin()));
