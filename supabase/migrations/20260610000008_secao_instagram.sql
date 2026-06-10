-- ============================================================================
--  Galeria "Instagram" na home (redesign): terceira seção de site_images.
--  O dono sobe as fotos no admin; a faixa só aparece com fotos + link do
--  Instagram configurado no white-label.
-- ============================================================================

alter table public.site_images
  drop constraint if exists site_images_section_check;
alter table public.site_images
  add constraint site_images_section_check
  check (section in ('loja', 'entrega', 'instagram'));
