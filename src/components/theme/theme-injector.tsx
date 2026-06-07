import { storeConfig } from "@/config/theme.config";

/**
 * Injeta as cores do storeConfig como CSS variables no :root.
 *
 * O Tailwind (em globals.css, via @theme inline) consome essas variáveis,
 * então trocar a paleta = editar theme.config.ts. Nenhum componente precisa
 * conhecer cor nenhuma — todos usam utilitários como `bg-surface`,
 * `text-primary`, etc.
 *
 * É um Server Component: o <style> sai pronto no HTML inicial, sem flash.
 */
export function ThemeInjector() {
  const c = storeConfig.colors;

  const css = `:root{--store-bg:${c.bg};--store-surface:${c.surface};--store-primary:${c.primary};--store-accent:${c.accent};--store-text:${c.text};--store-muted:${c.muted};}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
