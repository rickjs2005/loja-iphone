-- ============================================================================
--  REDESIGN "DARK LUXURY" — fundação de catálogo
--  - Categorias de linha Apple: macbook/ipad/watch/airpods (além de
--    iphone/accessory). Na home, cada card de categoria só aparece quando
--    existe produto ativo nela.
--  - Condição 'novo' (lacrado): badge "Novo" monocromático no catálogo.
--  - Legenda opcional nas fotos de entrega/loja (site_images.caption).
--  - Remove os "números da loja" (decisão de design: prova social = fotos
--    reais de loja e entrega, sem contadores). A garantia configurável fica.
-- ============================================================================

alter table public.products
  drop constraint if exists products_category_check;
alter table public.products
  add constraint products_category_check
  check (category in ('iphone', 'macbook', 'ipad', 'watch', 'airpods', 'accessory'));

alter table public.products
  drop constraint if exists products_condition_check;
alter table public.products
  add constraint products_condition_check
  check (condition in ('novo', 'vitrine', 'excelente', 'bom'));

alter table public.site_images
  add column if not exists caption text;

alter table public.store_settings
  drop column if exists stat_sold,
  drop column if exists stat_rating,
  drop column if exists stat_reviews,
  drop column if exists stat_satisfaction;
