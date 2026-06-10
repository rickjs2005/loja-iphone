-- ============================================================================
--  SEED — produtos de exemplo (preços em CENTAVOS)
--  Rode depois da migration inicial. As imagens são adicionadas pelo admin
--  (upload para o Storage), então aqui ficam só os produtos.
-- ============================================================================

insert into public.products (name, description, price_cents, stock, is_active, sort_order)
values
  ('iPhone 15 Pro Max 256GB', 'Titânio natural. Chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6,7".', 999900, 3, true, 1),
  ('iPhone 15 128GB',         'Dynamic Island, câmera de 48MP e USB-C. Disponível em várias cores.',            649900, 5, true, 2),
  ('iPhone 14 128GB',         'Excelente custo-benefício. Chip A15 Bionic e ótima bateria.',                     489900, 0, true, 3),
  ('iPhone 13 128GB',         'Clássico que não decepciona. Tela OLED e câmera dupla.',                          399900, 8, true, 4),
  ('iPhone SE (3ª geração)',  'Compacto e potente, com Touch ID e chip A15 Bionic.',                            269900, 4, true, 5);

-- Prova social de EXEMPLO (troque pelos números reais da loja no admin —
-- Conteúdo da loja). Campos vazios somem do site.
update public.store_settings
set warranty_text     = 'Garantia de 90 dias',
    stat_sold         = 3000,
    stat_rating       = 4.9,
    stat_reviews      = 312,
    stat_satisfaction = 98
where id = 1;
