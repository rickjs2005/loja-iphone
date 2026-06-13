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
              <div className="glass glass-rim glass-spec h-full rounded-3xl p-7 transition-shadow duration-300 hover:shadow-[0_28px_60px_-26px_rgba(0,0,0,0.9)]">
                <div className="glass glass-rim mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-fg/90">
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
