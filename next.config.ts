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

// CSP só em produção: em dev o Next depende de eval (HMR/refresh) e o header
// quebraria tudo. 'unsafe-inline' em script-src é necessário pelo bootstrap
// inline do Next (sem nonce configurado) e pelo theme-injector inline; em
// style-src, pelos estilos inline do Framer Motion/Next.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://store.storeimages.cdn-apple.com https://images.unsplash.com",
  "media-src 'self'",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

if (process.env.NODE_ENV === "production") {
  securityHeaders.push({
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  });
}

const nextConfig: NextConfig = {
  // Não expõe a versão do Next no header (reduz fingerprinting).
  poweredByHeader: false,
  // Sem o badge "N" flutuante do modo dev (confunde na demonstração).
  devIndicators: false,
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
