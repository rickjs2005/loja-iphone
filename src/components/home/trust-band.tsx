import type { ComponentType, SVGProps } from "react";
import { Container } from "@/components/ui/container";
import {
  BadgeCheckIcon,
  BoltIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/ui/icons";

const ITEMS: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
}[] = [
  {
    icon: ShieldIcon,
    title: "Garantia",
    subtitle: "Cobertura real em todos os aparelhos",
  },
  {
    icon: BadgeCheckIcon,
    title: "Procedência",
    subtitle: "Originais e desbloqueados",
  },
  {
    icon: BoltIcon,
    title: "Bateria verificada",
    subtitle: "Testamos todos os aparelhos",
  },
  {
    icon: TruckIcon,
    title: "Envio rápido",
    subtitle: "Para todo o Brasil",
  },
];

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
