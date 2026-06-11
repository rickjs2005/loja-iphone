-- ============================================================================
--  CATÁLOGO — Apple Watch e AirPods deixam de ser linhas próprias
--  Decisão de produto: poucas peças não justificam uma seção inteira na home.
--  Viram acessórios (subcategoria 'outros', ajustável produto a produto no
--  admin) e aparecem no filtro da vitrine "Complete seu ecossistema".
-- ============================================================================

-- Migra os produtos existentes ANTES de apertar o constraint (a ordem
-- inversa quebraria o ALTER em qualquer banco que já tenha watch/airpods).
update public.products
set category           = 'accessory',
    accessory_category = coalesce(accessory_category, 'outros')
where category in ('watch', 'airpods');

alter table public.products
  drop constraint if exists products_category_check;
alter table public.products
  add constraint products_category_check
  check (category in ('iphone', 'macbook', 'ipad', 'accessory'));
