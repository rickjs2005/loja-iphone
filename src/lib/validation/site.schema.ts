import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const siteSettingsSchema = z.object({
  address: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(300).optional(),
  ),
  hours: z.preprocess(emptyToUndefined, z.string().trim().max(300).optional()),
  maps_url: z.preprocess(
    emptyToUndefined,
    z.string().trim().url("Link do mapa inválido").max(500).optional(),
  ),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
