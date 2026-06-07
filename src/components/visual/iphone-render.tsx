import { cn } from "@/lib/cn";

/**
 * Render vetorial de um iPhone (frente), nítido em qualquer tamanho.
 * Usado no hero (grande) e nos cards quando não há foto real cadastrada.
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
      viewBox="0 0 280 560"
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
          <stop offset="35%" stopColor="#dcdce2" />
          <stop offset="60%" stopColor="#8a8a92" />
          <stop offset="100%" stopColor="#55555d" />
        </linearGradient>
        <radialGradient id={`${g}-glow`} cx="30%" cy="18%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${g}-reflect`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${g}-clip`}>
          <rect x="18" y="18" width="244" height="524" rx="48" />
        </clipPath>
      </defs>

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

      {/* Tela */}
      <rect
        x="18"
        y="18"
        width="244"
        height="524"
        rx="48"
        fill={`url(#${g}-screen)`}
      />

      {/* Brilho + reflexo de vidro (recortados na tela) */}
      <g clipPath={`url(#${g}-clip)`}>
        <rect x="18" y="18" width="244" height="524" fill={`url(#${g}-glow)`} />
        <polygon
          points="18,150 150,18 240,18 18,300"
          fill={`url(#${g}-reflect)`}
        />
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
