"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/user";
import {
  siteImageCaptionSchema,
  siteSettingsSchema,
} from "@/lib/validation/site.schema";
import { imageFileSchema } from "@/lib/validation/product.schema";
import { unitSchema } from "@/lib/validation/unit.schema";
import {
  addSiteImage,
  deleteSiteImage,
  getNextSiteImageOrder,
  updateSiteImageCaption,
  updateStoreSettings,
} from "@/lib/data/site";
import {
  createUnit,
  deleteUnit,
  getUnits,
  seedInventoryForFirstUnit,
  setTrackStockByUnit,
  updateUnit,
} from "@/lib/data/units";
import { getStoreSettings } from "@/lib/data/site";
import { removeProductImageByUrl, uploadSiteImage } from "@/lib/data/storage";
import type { SiteSection } from "@/types/database.types";

export type SiteFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /**
   * Valores digitados, ecoados junto com o erro: o React 19 reseta o form
   * pro defaultValue ATUAL após a action — ecoar evita perder o preenchido.
   */
  values?: Record<string, string>;
};

const isSection = (v: string): v is SiteSection =>
  v === "loja" || v === "entrega" || v === "instagram";

/** Campos de texto do FormData (nunca Files) pro form repreencher após erro. */
function echoValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

export async function saveSettingsAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireAdmin();

  const values = echoValues(formData);

  const parsed = siteSettingsSchema.safeParse({
    city: formData.get("city"),
    neighborhood: formData.get("neighborhood"),
    street: formData.get("street"),
    number: formData.get("number"),
    reference: formData.get("reference"),
    whatsapp: formData.get("whatsapp"),
    hours: formData.get("hours"),
    maps_url: formData.get("maps_url"),
    payment_methods: formData.get("payment_methods"),
    warranty_text: formData.get("warranty_text"),
  });
  if (!parsed.success) {
    return {
      error: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  try {
    await updateStoreSettings(parsed.data);
  } catch {
    return { error: "Não foi possível salvar. Tente de novo.", values };
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  return { ok: true };
}

/** Cria ou atualiza uma unidade física (decide pelo campo oculto "id"). */
export async function saveUnitAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireAdmin();

  const values = echoValues(formData);

  const parsed = unitSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city"),
    neighborhood: formData.get("neighborhood"),
    street: formData.get("street"),
    number: formData.get("number"),
    reference: formData.get("reference"),
    hours: formData.get("hours"),
    whatsapp: formData.get("whatsapp"),
    maps_url: formData.get("maps_url"),
    sort_order: formData.get("sort_order"),
  });
  if (!parsed.success) {
    return {
      error: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    };
  }

  const id = String(formData.get("id") || "");

  // Foto da fachada (opcional). Valida ANTES de salvar qualquer coisa.
  const photoFile = formData.get("photo");
  let photoUrl: string | undefined;
  if (photoFile instanceof File && photoFile.size > 0) {
    const valid = imageFileSchema.safeParse(photoFile);
    if (!valid.success) {
      return {
        error: valid.error.issues[0]?.message ?? "Foto inválida.",
        values,
      };
    }
    try {
      photoUrl = await uploadSiteImage("unidades", photoFile);
    } catch {
      return { error: "Falha ao enviar a foto. Tente de novo.", values };
    }
  }

  try {
    if (id) {
      await updateUnit(id, parsed.data, photoUrl);
    } else {
      // Primeira unidade COM o modo de estoque por unidade ligado? O estoque
      // atual de cada produto migra inteiro para ela (o total não muda).
      // Com o modo desligado (estoque compartilhado), nada a semear.
      const [unitsAntes, settings] = await Promise.all([
        getUnits(),
        getStoreSettings(),
      ]);
      const newId = await createUnit(parsed.data, photoUrl);
      if (unitsAntes.length === 0 && settings.track_stock_by_unit) {
        await seedInventoryForFirstUnit(newId);
      }
    }
  } catch {
    return { error: "Não foi possível salvar a unidade. Tente de novo.", values };
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  revalidatePath("/admin/produtos");
  return { ok: true };
}

/** Liga/desliga o controle de estoque por unidade (campo oculto "enabled"). */
export async function toggleUnitStockAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const enabled = String(formData.get("enabled")) === "1";
  await setTrackStockByUnit(enabled);

  revalidatePath("/");
  revalidatePath("/admin/loja");
  revalidatePath("/admin/produtos");
}

export async function deleteUnitAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  // O inventory da unidade sai em cascata; o trigger preserva o total dos
  // produtos (a loja volta ao modo de estoque único se era a última).
  await deleteUnit(id);

  revalidatePath("/");
  revalidatePath("/admin/loja");
  revalidatePath("/admin/produtos");
}

export async function uploadSiteImagesAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireAdmin();

  const section = String(formData.get("section") || "");
  if (!isSection(section)) return { error: "Seção inválida." };

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
    let order = await getNextSiteImageOrder(section);
    for (const file of files) {
      const url = await uploadSiteImage(section, file);
      await addSiteImage(section, url, order);
      order += 1;
    }
  } catch {
    return { error: "Falha ao enviar as imagens. Tente de novo." };
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  return { ok: true };
}

export async function saveSiteImageCaptionAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Imagem inválida." };

  const parsed = siteImageCaptionSchema.safeParse(formData.get("caption"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Legenda inválida." };
  }

  try {
    await updateSiteImageCaption(id, parsed.data ?? null);
  } catch {
    return { error: "Não foi possível salvar a legenda." };
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  return { ok: true };
}

export async function deleteSiteImageAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const url = String(formData.get("url") || "");
  if (!id) return;

  // Linha primeiro; arquivo órfão no storage é inofensivo (o inverso
  // deixaria a imagem quebrada no site se a 2ª etapa falhasse).
  await deleteSiteImage(id);
  try {
    await removeProductImageByUrl(url);
  } catch {
    // Arquivo órfão no storage não afeta a loja.
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
}
