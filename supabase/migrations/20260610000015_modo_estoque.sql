-- ============================================================================
--  Estoque por unidade vira MODO OPCIONAL (desligado por padrão).
--  Muitas redes compartilham o estoque entre as lojas (faltou numa, a outra
--  envia) — nesse caso o estoque é único mesmo com várias unidades.
--  Com o modo desligado, o trigger NÃO recalcula o total: linhas antigas de
--  inventory ficam dormentes e products.stock é a única fonte de verdade.
-- ============================================================================

alter table public.store_settings
  add column if not exists track_stock_by_unit boolean not null default false;

create or replace function public.sync_product_stock()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_product uuid := coalesce(new.product_id, old.product_id);
  v_total   integer;
begin
  -- Modo estoque único: inventário dormente não mexe no total.
  if not exists (
    select 1 from store_settings where id = 1 and track_stock_by_unit
  ) then
    return null;
  end if;

  select sum(stock) into v_total from inventory where product_id = v_product;
  if v_total is not null then
    update products set stock = v_total where id = v_product;
  end if;
  return null;
end;
$$;
