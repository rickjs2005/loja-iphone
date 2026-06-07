import type { ProductWithImages } from "./types";

/**
 * Produtos de exemplo para o MODO DEMO (quando não há Supabase configurado).
 * Espelham o supabase/seed.sql. Sem imagens — a UI mostra um placeholder
 * elegante, suficiente para pré-visualizar layout, hero, carrinho e WhatsApp.
 */
export const demoProducts: ProductWithImages[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "iPhone 15 Pro Max 256GB",
    description:
      "Titânio natural. Chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6,7\".",
    price_cents: 999900,
    stock: 3,
    installments: 12,
    is_active: true,
    sort_order: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "iPhone 15 128GB",
    description:
      "Dynamic Island, câmera de 48MP e USB-C. Disponível em várias cores.",
    price_cents: 649900,
    stock: 5,
    installments: 12,
    is_active: true,
    sort_order: 2,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [],
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "iPhone 14 128GB",
    description: "Excelente custo-benefício. Chip A15 Bionic e ótima bateria.",
    price_cents: 489900,
    stock: 0,
    installments: 10,
    is_active: true,
    sort_order: 3,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [],
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "iPhone 13 128GB",
    description: "Clássico que não decepciona. Tela OLED e câmera dupla.",
    price_cents: 399900,
    stock: 8,
    installments: 10,
    is_active: true,
    sort_order: 4,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [],
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "iPhone SE (3ª geração)",
    description: "Compacto e potente, com Touch ID e chip A15 Bionic.",
    price_cents: 269900,
    stock: 4,
    installments: 8,
    is_active: true,
    sort_order: 5,
    created_at: "2026-01-01T00:00:00.000Z",
    images: [],
  },
];

export function findDemoProduct(id: string): ProductWithImages | null {
  return demoProducts.find((p) => p.id === id) ?? null;
}
