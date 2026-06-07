"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/user";
import { siteSettingsSchema } from "@/lib/validation/site.schema";
import { imageFileSchema } from "@/lib/validation/product.schema";
import {
  addSiteImage,
  countSiteImages,
  deleteSiteImage,
  updateStoreSettings,
} from "@/lib/data/site";
import { removeProductImageByUrl, uploadSiteImage } from "@/lib/data/storage";
import type { SiteSection } from "@/types/database.types";

export type SiteFormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const isSection = (v: string): v is SiteSection =>
  v === "loja" || v === "entrega";

export async function saveSettingsAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireUser();

  const parsed = siteSettingsSchema.safeParse({
    address: formData.get("address"),
    hours: formData.get("hours"),
    maps_url: formData.get("maps_url"),
  });
  if (!parsed.success) {
    return {
      error: "Confira os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await updateStoreSettings(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/loja");
  return { ok: true };
}

export async function uploadSiteImagesAction(
  _prev: SiteFormState,
  formData: FormData,
): Promise<SiteFormState> {
  await requireUser();

  const section = String(formData.get("section") || "");
  if (!isSection(section)) return { error: "Seção inválida." };

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Selecione ao menos uma imagem." };

  let order = await countSiteImages(section);
  for (const file of files) {
    const valid = imageFileSchema.safeParse(file);
    if (!valid.success) {
      return { error: valid.error.issues[0]?.message ?? "Imagem inválida." };
    }
    const url = await uploadSiteImage(section, file, order);
    await addSiteImage(section, url, order);
    order += 1;
  }

  revalidatePath("/");
  revalidatePath("/admin/loja");
  return { ok: true };
}

export async function deleteSiteImageAction(formData: FormData): Promise<void> {
  await requireUser();
  const id = String(formData.get("id") || "");
  const url = String(formData.get("url") || "");
  if (!id) return;

  await removeProductImageByUrl(url);
  await deleteSiteImage(id);
  revalidatePath("/");
  revalidatePath("/admin/loja");
}
