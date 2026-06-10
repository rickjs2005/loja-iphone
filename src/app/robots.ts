import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Regras de indexação: loja pública sim; admin e carrinho não. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/carrinho"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
