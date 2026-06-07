import type { ProductImageRow, ProductRow } from "@/types/database.types";

/** Produto com sua galeria de imagens já ordenada. */
export type ProductWithImages = ProductRow & {
  images: ProductImageRow[];
};

export type ProductCategory = "iphone" | "accessory";
export type AccessoryCategory = "carregadores" | "capas" | "audio" | "outros";
export type Condition = "vitrine" | "excelente" | "bom";

/** Subcategorias de acessório (valor no banco + rótulo na UI). */
export const ACCESSORY_CATEGORIES: { value: AccessoryCategory; label: string }[] =
  [
    { value: "carregadores", label: "Carregadores" },
    { value: "capas", label: "Capas e Películas" },
    { value: "audio", label: "Áudio / AirPods" },
    { value: "outros", label: "Outros" },
  ];

/** Condição estética do iPhone seminovo. */
export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "vitrine", label: "Vitrine (impecável)" },
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
];

export function accessoryCategoryLabel(value: string | null): string {
  return ACCESSORY_CATEGORIES.find((c) => c.value === value)?.label ?? "Acessório";
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

export function isInStock(product: Pick<ProductRow, "stock">): boolean {
  return product.stock > 0;
}
