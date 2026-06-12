import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  BagIcon,
  CheckIcon,
  HeadsetIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";
import { copy, withStoreName } from "@/config/copy";
import type { ReactNode } from "react";

// Ícones na MESMA ordem dos textos em copy.features.items.
// Traço fino (1.5): elegância de Apple Store, sem peso visual.
const ICONS: ReactNode[] = [
  <HeadsetIcon key="h" className="size-6" strokeWidth={1.5} />,
  <ShieldIcon key="s" className="size-6" strokeWidth={1.5} />,
  <CheckIcon key="c" className="size-6" strokeWidth={1.5} />,
  <BagIcon key="b" className="size-6" strokeWidth={1.5} />,
];

const FEATURES = copy.features.items.map((item, i) => ({
  ...item,
  icon: ICONS[i],
}));

/** Bloco "por que comprar aqui" — reforça confiança e valor. */
export function Features() {
  return (
    <section id="porque" className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={copy.features.eyebrow}
            title={withStoreName(copy.features.title, storeConfig.name)}
            subtitle={copy.features.subtitle}
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Estética "Apple Store": vidro fosco leve, traço fino, respiro
              generoso e hierarquia calma (título médio, descrição suave). */}
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.06]">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-fg/90">
                  {f.icon}
                </div>
                <h3 className="font-medium tracking-tight text-fg">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
