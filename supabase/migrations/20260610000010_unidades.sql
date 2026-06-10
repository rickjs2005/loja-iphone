-- ============================================================================
--  MULTI-UNIDADES: lojas com mais de um ponto físico.
--  - units: nome, endereço, horário, WhatsApp e mapa POR unidade.
--  - inventory: estoque POR unidade (product × unit).
--  - products.stock continua sendo o TOTAL: um trigger soma o inventory a
--    cada mudança, então vitrine/carrinho/admin seguem funcionando sem
--    alteração. Loja sem unidades cadastradas opera como hoje (estoque único).
-- ============================================================================

create table if not exists public.units (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  address    text,
  hours      text,
  whatsapp   text,
  maps_url   text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists units_sort_idx on public.units (sort_order);

alter table public.units enable row level security;

create policy "unidades sao publicas"
  on public.units for select to anon, authenticated using (true);
create policy "admin insere unidades"
  on public.units for insert to authenticated with check (public.is_admin());
create policy "admin atualiza unidades"
  on public.units for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin remove unidades"
  on public.units for delete to authenticated using (public.is_admin());

grant select on public.units to anon, authenticated;
grant insert, update, delete on public.units to authenticated;

-- ---------------------------------------------------------------------------
-- Estoque por unidade
-- ---------------------------------------------------------------------------
create table if not exists public.inventory (
  product_id uuid not null references public.products (id) on delete cascade,
  unit_id    uuid not null references public.units (id) on delete cascade,
  stock      integer not null default 0 check (stock >= 0),
  primary key (product_id, unit_id)
);

create index if not exists inventory_unit_idx on public.inventory (unit_id);

alter table public.inventory enable row level security;

create policy "estoque por unidade e publico"
  on public.inventory for select to anon, authenticated using (true);
create policy "admin insere estoque"
  on public.inventory for insert to authenticated with check (public.is_admin());
create policy "admin atualiza estoque"
  on public.inventory for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admin remove estoque"
  on public.inventory for delete to authenticated using (public.is_admin());

grant select on public.inventory to anon, authenticated;
grant insert, update, delete on public.inventory to authenticated;

-- ---------------------------------------------------------------------------
-- products.stock = soma do inventory (quando houver linhas).
-- Se a ÚLTIMA linha de um produto some (ex.: última unidade excluída), o
-- total anterior é preservado — a loja volta ao modo de estoque único sem
-- zerar nada.
-- ---------------------------------------------------------------------------
create or replace function public.sync_product_stock()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_product uuid := coalesce(new.product_id, old.product_id);
  v_total   integer;
begin
  select sum(stock) into v_total from inventory where product_id = v_product;
  if v_total is not null then
    update products set stock = v_total where id = v_product;
  end if;
  return null;
end;
$$;

drop trigger if exists inventory_sync_stock on public.inventory;
create trigger inventory_sync_stock
  after insert or update or delete on public.inventory
  for each row execute function public.sync_product_stock();
