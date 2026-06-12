-- ============================================================================
--  CONTEÚDO — Foto da fachada da MATRIZ
--  As unidades sempre tiveram foto (units.photo_url); a matriz, que nasce das
--  "Informações da loja", ficava sem — o card dela aparecia pelado ao lado
--  dos cards com foto. Mesmo padrão: coluna opcional, upload pelo admin.
-- ============================================================================

alter table public.store_settings
  add column if not exists photo_url text;
