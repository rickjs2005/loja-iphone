-- ============================================================================
--  Endereço estruturado por unidade (nada obrigatório): cidade, bairro,
--  rua, número e ponto de referência. O campo livre `address` permanece
--  como legado/fallback de exibição. Cada unidade já tem WhatsApp e mapa
--  próprios; com 2+ unidades atendendo, o site passa a perguntar ao
--  cliente em qual loja ele quer ser atendido antes de abrir o WhatsApp.
-- ============================================================================

alter table public.units
  add column if not exists city         text,
  add column if not exists neighborhood text,
  add column if not exists street       text,
  add column if not exists number       text,
  add column if not exists reference    text;
