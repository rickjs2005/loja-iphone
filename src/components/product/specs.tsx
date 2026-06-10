import {
  BadgeCheckIcon,
  BoltIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/ui/icons";
import type { ReactNode } from "react";

const ITEMS: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <BoltIcon className="size-5" />,
    title: "Bateria testada",
    text: "Saúde da bateria verificada e informada antes da compra.",
  },
  {
    icon: <BadgeCheckIcon className="size-5" />,
    title: "Procedência (IMEI)",
    text: "Origem verificada, sem bloqueio e com nota fiscal.",
  },
  {
    icon: <TruckIcon className="size-5" />,
    title: "Envio para todo Brasil",
    text: "Enviamos com rastreio para todo o país.",
  },
];

/**
 * Bloco de garantias/benefícios na página de produto.
 * O texto da garantia vem do admin (Conteúdo da loja); vazio usa o genérico.
 */
export function Specs({ warrantyText }: { warrantyText?: string | null }) {
  const items = [
    {
      icon: <ShieldIcon className="size-5" />,
      title: warrantyText?.trim() || "Garantia da loja",
      text: "Cobertura contra defeitos. Deu problema, a gente resolve.",
    },
    ...ITEMS,
  ];

  return (
    <div>
      <h2 className="mb-5 text-xl font-bold text-fg">Garantias e benefícios</h2>
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
