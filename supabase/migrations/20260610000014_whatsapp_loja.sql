-- ============================================================================
--  WhatsApp da loja editável no admin (paridade com as unidades, que já têm
--  número próprio). O número do white-label (env) vira apenas fallback.
-- ============================================================================

alter table public.store_settings
  add column if not exists whatsapp text;
