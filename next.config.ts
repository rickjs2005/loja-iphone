import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Não expõe a versão do Next no header (reduz fingerprinting).
  poweredByHeader: false,
  experimental: {
    // Uploads de fotos passam pela Server Action; o padrão (1 MB) estoura com
    // múltiplas imagens (cada uma até 5 MB pela validação do produto).
    serverActions: { bodySizeLimit: "30mb" },
  },
  images: {
    remotePatterns: [
      // Imagens dos produtos servidas pelo Supabase Storage.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Fotos de catálogo hotlinkadas (demo): CDN oficial da Apple e Unsplash.
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
