import { cn } from "@/lib/cn";

/**
 * Render vetorial de um iPhone (frente), nítido em qualquer tamanho.
 * Usado nos cards e no detalhe quando não há foto real cadastrada.
 * Quando o dono sobe fotos no admin, elas substituem este render.
 *
 * `uid` torna os ids dos gradientes únicos (vários renders na mesma página).
 */

export type Colorway = "natural" | "blue" | "purple" | "pink" | "graphite";

const wallpapers: Record<Colorway, [string, string, string]> = {
  natural: ["#1d2b4d", "#3a2358", "#4d1d3a"],
  blue: ["#082a5e", "#0a84ff", "#4aa8ff"],
  purple: ["#2e1a63", "#6e5cf6", "#a78bff"],
  pink: ["#5e1430", "#ff2d55", "#ff86a6"],
  graphite: ["#15151a", "#2a2a33", "#3c3c46"],
};

export const colorwayByIndex = (i: number): Colorway =>
  (["natural", "blue", "purple", "pink", "graphite"] as const)[i % 5];

export function IphoneRender({
  colorway = "natural",
  uid,
  className,
}: {
  colorway?: Colorway;
  uid: string;
  className?: string;
}) {
  const g = `ip-${uid}`;
  const [c1, c2, c3] = wallpapers[colorway];

  return (
    <svg
      viewBox="0 0 280 600"
      className={cn("h-full w-full", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="iPhone"
    >
      <defs>
        <linearGradient id={`${g}-screen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="50%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
        <linearGradient id={`${g}-frame`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6e6e76" />
          <stop offset="35%" stopColor="#e2e2e8" />
          <stop offset="60%" stopColor="#8a8a92" />
          <stop offset="100%" stopColor="#4f4f57" />
        </linearGradient>
        <radialGradient id={`${g}-glow`} cx="30%" cy="16%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-reflect`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${g}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${g}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${g}-clip`}>
          <rect x="18" y="18" width="244" height="524" rx="48" />
        </clipPath>
      </defs>

      {/* Sombra de contato no chão */}
      <ellipse cx="140" cy="572" rx="104" ry="18" fill={`url(#${g}-shadow)`} />

      {/* Corpo / frame metálico */}
      <rect
        x="6"
        y="6"
        width="268"
        height="548"
        rx="58"
        fill="#0a0a0c"
        stroke={`url(#${g}-frame)`}
        strokeWidth="6"
      />
      {/* Realce interno do frame */}
      <rect
        x="12"
        y="12"
        width="256"
        height="536"
        rx="52"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="1"
      />

      {/* Tela */}
      <rect
        x="18"
        y="18"
        width="244"
        height="524"
        rx="48"
        fill={`url(#${g}-screen)`}
      />

      {/* Brilho, reflexo e gloss (recortados na tela) */}
      <g clipPath={`url(#${g}-clip)`}>
        <rect x="18" y="18" width="244" height="524" fill={`url(#${g}-glow)`} />
        <polygon
          points="18,150 150,18 240,18 18,300"
          fill={`url(#${g}-reflect)`}
        />
        <rect x="150" y="18" width="60" height="524" fill={`url(#${g}-gloss)`} />
      </g>

      {/* Dynamic Island */}
      <rect x="108" y="34" width="64" height="20" rx="10" fill="#000000" />
      <circle cx="160" cy="44" r="3.4" fill="#0b0e16" />

      {/* Botões laterais */}
      <rect x="1.5" y="150" width="4.5" height="30" rx="2" fill={`url(#${g}-frame)`} />
      <rect x="1.5" y="196" width="4.5" height="48" rx="2" fill={`url(#${g}-frame)`} />
      <rect x="274" y="180" width="4.5" height="70" rx="2" fill={`url(#${g}-frame)`} />
    </svg>
  );
}
