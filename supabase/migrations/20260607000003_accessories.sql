-- ============================================================================
--  ACESSÓRIOS + atributos por tipo de produto
--  - category: 'iphone' | 'accessory'
--  - accessory_category: subcategoria (só acessórios)
--  - battery_health / condition: atributos de iPhone seminovo
-- ============================================================================

alter table public.products
  add column if not exists category text not null default 'iphone'
    check (category in ('iphone', 'accessory')),
  add column if not exists accessory_category text
    check (accessory_category in ('carregadores', 'capas', 'audio', 'outros')),
  add column if not exists battery_health integer
    check (battery_health between 0 and 100),
  add column if not exists condition text
    check (condition in ('vitrine', 'excelente', 'bom'));

create index if not exists products_category_idx
  on public.products (category, is_active, sort_order);
