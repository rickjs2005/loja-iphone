-- ============================================================================
--  Endereço estruturado também nas Informações da loja (modo sem unidades),
--  espelhando o formato das unidades: cidade, bairro, rua, número e ponto
--  de referência — nada obrigatório. O campo livre `address` vira legado/
--  fallback de exibição, como nas units.
-- ============================================================================

alter table public.store_settings
  add column if not exists city         text,
  add column if not exists neighborhood text,
  add column if not exists street       text,
  add column if not exists number       text,
  add column if not exists reference    text;
