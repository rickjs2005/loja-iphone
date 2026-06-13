import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

/** Anel de foco visível compartilhado — use em botões "crus" fora do <Button>. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

// Cápsula (rounded-full) = assinatura visual da Apple. `glass-sheen` varre a
// luz no hover; `glass-gloss` é o domo de brilho líquido na metade superior;
// o ring-inset branco é a borda iluminada do vidro.
const base = `glass-sheen inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 ${focusRing} disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]`;

const variants: Record<Variant, string> = {
  primary:
    "glass-gloss bg-primary text-white ring-1 ring-inset ring-white/30 shadow-lg shadow-primary/40 hover:brightness-110 hover:shadow-primary/55 hover:-translate-y-0.5",
  accent:
    "glass-gloss bg-accent text-white ring-1 ring-inset ring-white/30 shadow-lg shadow-accent/40 hover:brightness-110 hover:shadow-accent/55 hover:-translate-y-0.5",
  // Secundário de vidro: cápsula translúcida, discreta mas premium.
  outline:
    "border border-white/20 bg-white/[0.08] text-fg backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:border-white/35 hover:bg-white/[0.12]",
  ghost: "text-fg hover:bg-white/5",
  // CTA principal do sistema: cápsula de vidro verde com glow forte e gloss.
  whatsapp:
    "glass-gloss bg-whatsapp text-black ring-1 ring-inset ring-white/45 shadow-lg shadow-whatsapp/45 hover:brightness-105 hover:shadow-whatsapp/65 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
