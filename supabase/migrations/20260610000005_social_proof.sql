-- ============================================================================
--  PROVA SOCIAL EDITÁVEL + GARANTIA CONFIGURÁVEL
--  Antes: avaliações, depoimentos e números ("+3.000 vendidos", "4,9") eram
--  fixos no código — dado fictício em loja real. Agora o dono preenche os
--  números REAIS no admin (campo vazio = seção some da loja) e cadastra os
--  depoimentos dos clientes dele. A garantia ("90 dias") também vira texto
--  configurável por loja.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- store_settings: garantia + números da loja (null = não exibir)
-- ---------------------------------------------------------------------------
alter table public.store_settings
  add column if not exists warranty_text text,
  add column if not exists stat_sold integer
    check (stat_sold is null or stat_sold >= 0),
  add column if not exists stat_rating numeric(2,1)
    check (stat_rating is null or (stat_rating >= 0 and stat_rating <= 5)),
  add column if not exists stat_reviews integer
    check (stat_reviews is null or stat_reviews >= 0),
  add column if not exists stat_satisfaction integer
    check (stat_satisfaction is null or stat_satisfaction between 0 and 100);

-- ---------------------------------------------------------------------------
-- Depoimentos de clientes (exibidos na página do produto)
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  text       text not null,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

alter table public.testimonials enable row level security;

create policy "depoimentos sao publicos"
  on public.testimonials for select
  to anon, authenticated
  using (true);

create policy "admin insere depoimentos"
  on public.testimonials for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "admin atualiza depoimentos"
  on public.testimonials for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "admin remove depoimentos"
  on public.testimonials for delete
  to authenticated
  using ((select public.is_admin()));
