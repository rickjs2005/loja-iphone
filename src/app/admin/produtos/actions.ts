"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/user";
import { productSchema } from "@/lib/validation/product.schema";
import { imageFileSchema } from "@/lib/validation/product.schema";
import {
  addProductImage,
  countProductImages,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProductById,
  setProductActive,
  updateProduct,
} from "@/lib/data/products";
import {
  removeProductImageByUrl,
  uploadProductImage,
} from "@/lib/data/storage";

export type ProductFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v: string) => UUID_RE.test(v);

function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price_cents: formData.get("price_cents"),
    stock: formData.get("stock"),
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });
}

/** Cria ou atualiza um produto (decide pelo campo oculto "id"). */
export async function saveProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireUser();

  const parsed = parseProduct(formData);
  if (!parsed.success) {
    return { error: "Confira os campos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const id = String(formData.get("id") || "");

  if (id) {
    await updateProduct(id, parsed.data);
    revalidatePath("/admin/produtos");
    revalidatePath(`/admin/produtos/${id}`);
    revalidatePath("/");
    return { ok: true };
  }

  const newId = await createProduct(parsed.data);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
  // Vai para a edição para adicionar as fotos do produto recém-criado.
  redirect(`/admin/produtos/${newId}`);
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;

  // Remove os arquivos do Storage antes de apagar as linhas (cascade no banco).
  const product = await getProductById(id);
  if (product) {
    for (const img of product.images) {
      await removeProductImageByUrl(img.url);
    }
  }

  await deleteProduct(id);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") || "");
  const next = formData.get("next") === "true";
  if (!id) return;

  await setProductActive(id, next);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

/** Upload de uma ou mais fotos para um produto existente. */
export async function uploadImagesAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireUser();

  const productId = String(formData.get("productId") || "");
  if (!isUuid(productId)) return { error: "Produto inválido." };

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return { error: "Selecione ao menos uma imagem." };

  let order = await countProductImages(productId);

  for (const file of files) {
    const valid = imageFileSchema.safeParse(file);
    if (!valid.success) {
      return { error: valid.error.issues[0]?.message ?? "Imagem inválida." };
    }
    const url = await uploadProductImage(productId, file, order);
    await addProductImage(productId, url, order);
    order += 1;
  }

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteImageAction(formData: FormData): Promise<void> {
  await requireUser();
  const imageId = String(formData.get("imageId") || "");
  const url = String(formData.get("url") || "");
  const productId = String(formData.get("productId") || "");
  if (!imageId) return;

  await removeProductImageByUrl(url);
  await deleteProductImage(imageId);
  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/");
}
