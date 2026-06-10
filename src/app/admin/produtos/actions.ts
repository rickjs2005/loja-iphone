"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/user";
import { productSchema } from "@/lib/validation/product.schema";
import { imageFileSchema } from "@/lib/validation/product.schema";
import {
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getNextImageOrder,
  getProductById,
  setProductActive,
  updateProduct,
} from "@/lib/data/products";
import {
  removeImagesByUrls,
  removeProductImageByUrl,
  uploadProductImage,
} from "@/lib/data/storage";

export type ProductFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /**
   * Valores digitados, ecoados junto com o erro: o React 19 reseta o form
   * pro defaultValue ATUAL após a action — ecoar evita perder o preenchido.
   */
  values?: Record<string, string>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v: string) => UUID_RE.test(v);

/** Campos de texto do FormData (nunca Files) pro form repreencher após erro. */
function echoValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

function parseProduct(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price_cents: formData.get("price_cents"),
    stock: formData.get("stock"),
    installments: formData.get("installments"),
    category: formData.get("category") || "iphone",
    accessory_category: formData.get("accessory_category"),
    battery_health: formData.get("battery_health"),
    condition: formData.get("condition"),
    is_active: formData.get("is_active") === "on",
    sort_order: formData.get("sort_order"),
  });
}

/** Cria ou atualiza um produto (decide pelo campo oculto "id"). */
export async function saveProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const values = echoValues(formData);

  const parsed = parseProduct(formData);
  if (!parsed.success) {
    return {
      error: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const id = String(formData.get("id") || "");

  if (id) {
    try {
      await updateProduct(id, parsed.data);
    } catch {
      return { error: "Não foi possível salvar as alterações. Tente de novo.", values };
    }
    revalidatePath("/admin/produtos");
    revalidatePath(`/admin/produtos/${id}`);
    revalidatePath("/");
    return { ok: true };
  }

  // Fotos opcionais escolhidas já no cadastro: valida ANTES de criar o produto
  // para não deixar um produto criado caso alguma imagem seja inválida.
  const newFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  for (const file of newFiles) {
    const valid = imageFileSchema.safeParse(file);
    if (!valid.success) {
      return { error: valid.error.issues[0]?.message ?? "Imagem inválida.", values };
    }
  }

  let newId: string;
  try {
    newId = await createProduct(parsed.data);
  } catch {
    return { error: "Não foi possível criar o produto. Tente de novo.", values };
  }

  // Sobe as imagens (se houver) agora que o produto — e seu ID — existem.
  try {
    let order = 0; // produto recém-criado: galeria começa do zero
    for (const file of newFiles) {
      const url = await uploadProductImage(newId, file);
      await addProductImage(newId, url, order);
      order += 1;
    }
  } catch {
    // O produto existe; reenviar o form criaria um duplicado. Orienta a
    // completar as fotos na tela de edição.
    revalidatePath("/admin/produtos");
    revalidatePath("/");
    return {
      error:
        "Produto criado, mas as fotos falharam — adicione-as na tela de edição.",
      values,
    };
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  // Volta para a lista com aviso de sucesso.
  redirect("/admin/produtos?criado=1");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  // Coleta as URLs ANTES: o cascade do banco apaga as linhas de imagens.
  const product = await getProductById(id);
  const urls = product?.images.map((img) => img.url) ?? [];

  // Produto sai do ar primeiro; só depois o storage. Se a remoção dos
  // arquivos falhar, sobra órfão no bucket — inofensivo (o inverso deixaria
  // um produto ativo com fotos quebradas).
  await deleteProduct(id);
  try {
    await removeImagesByUrls(urls);
  } catch {
    // Arquivo órfão no storage não afeta a loja.
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function toggleActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();
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
  await requireAdmin();

  const productId = String(formData.get("productId") || "");
  if (!isUuid(productId)) return { error: "Produto inválido." };

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) return { error: "Selecione ao menos uma imagem." };

  // Valida TODOS os arquivos antes do primeiro upload: nada de upload
  // parcial (um retry depois duplicaria as fotos que já subiram).
  for (const file of files) {
    const valid = imageFileSchema.safeParse(file);
    if (!valid.success) {
      return { error: valid.error.issues[0]?.message ?? "Imagem inválida." };
    }
  }

  try {
    let order = await getNextImageOrder(productId);
    for (const file of files) {
      const url = await uploadProductImage(productId, file);
      await addProductImage(productId, url, order);
      order += 1;
    }
  } catch {
    return { error: "Falha ao enviar as imagens. Tente de novo." };
  }

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const imageId = String(formData.get("imageId") || "");
  const url = String(formData.get("url") || "");
  const productId = String(formData.get("productId") || "");
  if (!imageId) return;

  // Linha primeiro; arquivo órfão no storage é inofensivo (o inverso
  // deixaria a imagem quebrada na loja se a 2ª etapa falhasse).
  await deleteProductImage(imageId);
  try {
    await removeProductImageByUrl(url);
  } catch {
    // Arquivo órfão no storage não afeta a loja.
  }

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/");
}
