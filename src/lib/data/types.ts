import type { ProductImageRow, ProductRow } from "@/types/database.types";

/** Produto com sua galeria de imagens já ordenada. */
export type ProductWithImages = ProductRow & {
  images: ProductImageRow[];
};

export type ProductCategory = "iphone" | "macbook" | "ipad" | "accessory";
export type AccessoryCategory = "carregadores" | "capas" | "audio" | "outros";
export type Condition = "novo" | "vitrine" | "excelente" | "bom";

/**
 * Linhas de produto Apple (valor no banco + rótulos na UI).
 * Apple Watch e AirPods não têm linha própria: entram como acessórios
 * (subcategoria) e aparecem no filtro da vitrine de acessórios.
 */
export const CATEGORIES: {
  value: ProductCategory;
  label: string;
  plural: string;
}[] = [
  { value: "iphone", label: "iPhone", plural: "iPhones" },
  { value: "macbook", label: "MacBook", plural: "MacBooks" },
  { value: "ipad", label: "iPad", plural: "iPads" },
  { value: "accessory", label: "Acessório", plural: "Acessórios" },
];

export function categoryLabel(value: string | null): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? "Produto";
}

export function isProductCategory(v: string): v is ProductCategory {
  return CATEGORIES.some((c) => c.value === v);
}

/** Subcategorias de acessório (valor no banco + rótulo na UI). */
export const ACCESSORY_CATEGORIES: { value: AccessoryCategory; label: string }[] =
  [
    { value: "carregadores", label: "Carregadores" },
    { value: "capas", label: "Capas e Películas" },
    { value: "audio", label: "Áudio / AirPods" },
    { value: "outros", label: "Outros" },
  ];

/** Condição do aparelho ('novo' = lacrado; o resto é estado de seminovo). */
export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "novo", label: "Novo (lacrado)" },
  { value: "vitrine", label: "Vitrine (impecável)" },
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
];

export function isNew(p: Pick<ProductRow, "condition">): boolean {
  return p.condition === "novo";
}

export function conditionLabel(value: string | null): string | null {
  return CONDITIONS.find((c) => c.value === value)?.label ?? null;
}

export function isAccessory(p: Pick<ProductRow, "category">): boolean {
  return p.category === "accessory";
}

/** Imagem de capa (primeira da galeria) ou null. */
export function coverImage(product: ProductWithImages): ProductImageRow | null {
  return product.images[0] ?? null;
}

