-- ============================================================================
--  Foto da fachada POR unidade: redes com lojas em várias cidades têm o
--  mesmo nome e horário, mas cada ponto tem sua foto. O horário próprio da
--  unidade já era opcional — o app passa a herdar o horário geral quando
--  a unidade não define o seu.
-- ============================================================================

alter table public.units
  add column if not exists photo_url text;
