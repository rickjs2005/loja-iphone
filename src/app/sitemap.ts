import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/data/products";

// Mesma base do metadataBase no layout raiz.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Sitemap dinâmico: home + páginas de produto ativas. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((p) => ({
      url: `${siteUrl}/produtos/${p.id}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
