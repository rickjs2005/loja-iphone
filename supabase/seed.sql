-- ============================================================================
--  SEED — produtos de exemplo (preços em CENTAVOS)
--  Rode depois das migrations. As imagens são adicionadas pelo admin
--  (upload para o Storage), então aqui ficam só os produtos.
-- ============================================================================

insert into public.products (name, description, price_cents, stock, is_active, sort_order, category, condition, battery_health)
values
  ('iPhone 15 Pro Max 256GB', 'Titânio natural. Chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6,7".', 999900, 3, true, 1, 'iphone',  'novo',      100),
  ('iPhone 15 128GB',         'Dynamic Island, câmera de 48MP e USB-C. Disponível em várias cores.',            649900, 5, true, 2, 'iphone',  'excelente', 100),
  ('iPhone 14 128GB',         'Excelente custo-benefício. Chip A15 Bionic e ótima bateria.',                     489900, 0, true, 3, 'iphone',  'excelente', 100),
  ('iPhone 13 128GB',         'Clássico que não decepciona. Tela OLED e câmera dupla.',                          399900, 8, true, 4, 'iphone',  'excelente', 100),
  ('iPhone SE (3ª geração)',  'Compacto e potente, com Touch ID e chip A15 Bionic.',                            269900, 4, true, 5, 'iphone',  'excelente', 100),
  ('MacBook Air M2 256GB',    'Leve, silencioso e com bateria para o dia todo. Tela Liquid Retina de 13,6".',    799900, 2, true, 6, 'macbook', 'novo',      null),
  ('AirPods Pro (2ª geração)','Cancelamento ativo de ruído e estojo MagSafe com USB-C.',                         189900, 6, true, 7, 'airpods', 'novo',      null);

-- Garantia de exemplo (troque pelo texto real da loja no admin —
-- Conteúdo da loja).
update public.store_settings
set warranty_text = 'Garantia de 90 dias'
where id = 1;
