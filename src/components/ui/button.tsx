import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

/** Anel de foco visível compartilhado — use em botões "crus" fora do <Button>. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

const base = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ${focusRing} disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]`;

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20",
  accent: "bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/20",
  outline:
    "border border-white/15 bg-surface/60 text-fg hover:border-white/30 hover:bg-surface",
  ghost: "text-fg hover:bg-white/5",
  whatsapp: "bg-[#25D366] text-black hover:brightness-105 shadow-lg shadow-[#25D366]/20",
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
