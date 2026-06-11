import type { ComponentType, SVGProps } from "react";
import { Container } from "@/components/ui/container";
import {
  BadgeCheckIcon,
  BoltIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { copy } from "@/config/copy";

// Ícones na MESMA ordem dos textos em copy.trustBand.
const ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  ShieldIcon,
  BadgeCheckIcon,
  BoltIcon,
  TruckIcon,
];

const ITEMS = copy.trustBand.map((item, i) => ({ ...item, icon: ICONS[i] }));

/** Faixa de confiança logo abaixo do hero — 4 mini-cards monocromáticos. */
export function TrustBand() {
  return (
    <div className="border-y border-white/10">
      <Container className="grid grid-cols-2 gap-3 py-6 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, subtitle }) => (
          <div
            key={title}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            {/* Chip de ícone monocromático */}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-fg">
              <Icon className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-fg">
                {title}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {subtitle}
              </span>
            </span>
          </div>
        ))}
      </Container>
    </div>
  );
}
