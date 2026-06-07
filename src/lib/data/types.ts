import type { ProductImageRow, ProductRow } from "@/types/database.types";

/** Produto com sua galeria de imagens já ordenada. */
export type ProductWithImages = ProductRow & {
  images: ProductImageRow[];
};

/** Imagem de capa (primeira da galeria) ou null. */
export function coverImage(product: ProductWithImages): ProductImageRow | null {
  return product.images[0] ?? null;
}

export function isInStock(product: Pick<ProductRow, "stock">): boolean {
  return product.stock > 0;
}
