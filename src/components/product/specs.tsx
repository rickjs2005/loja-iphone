import {
  BadgeCheckIcon,
  BoltIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/ui/icons";
import { copy } from "@/config/copy";
import type { ReactNode } from "react";

// Ícones na MESMA ordem dos textos em copy.productBenefits.items.
const ICONS: ReactNode[] = [
  <BoltIcon key="b" className="size-5" />,
  <BadgeCheckIcon key="p" className="size-5" />,
  <TruckIcon key="t" className="size-5" />,
];

const ITEMS = copy.productBenefits.items.map((item, i) => ({
  ...item,
  icon: ICONS[i],
}));

/**
 * Bloco de garantias/benefícios na página de produto.
 * O texto da garantia vem do admin (Conteúdo da loja); vazio usa o genérico.
 */
export function Specs({ warrantyText }: { warrantyText?: string | null }) {
  const items = [
    {
      icon: <ShieldIcon className="size-5" />,
      title: warrantyText?.trim() || copy.productBenefits.warrantyFallbackTitle,
      text: copy.productBenefits.warrantyText,
    },
    ...ITEMS,
  ];

  return (
    <div>
      <h2 className="mb-5 text-xl font-bold text-fg">
        {copy.productBenefits.heading}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
          >
            <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fg">
              {it.icon}
            </div>
            <div>
              <h3 className="font-medium text-fg">{it.title}</h3>
              <p className="mt-0.5 text-sm text-muted">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
