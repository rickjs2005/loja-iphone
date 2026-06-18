import { storeConfig } from "./theme.config";

/**
 * Configuração do TENANT (loja ativa) — fonte única de identidade para o Admin
 * e para a loja pública.
 *
 * Hoje os valores vêm do theme.config (variáveis de ambiente NEXT_PUBLIC_*,
 * com fallback). Amanhã, num cenário multi-tenant com banco, basta trocar a
 * origem aqui (ex.: carregar pela subdomínio/host) sem tocar nos componentes.
 *
 * O Admin usa uma base neutra (zinc) estável entre tenants e aplica APENAS a
 * cor de destaque (accent) do tenant — via os utilitários `*-primary`
 * (mapeados para a CSS var --store-primary injetada pelo ThemeInjector).
 */
export const tenant = {
  name: storeConfig.name,
  logoUrl: storeConfig.logoUrl,
  /** Cor de destaque (Primary/Accent) do tenant. */
  accent: storeConfig.colors.primary,
  colors: storeConfig.colors,
} as const;
