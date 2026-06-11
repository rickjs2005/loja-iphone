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
const ICONS: ReactNode[] = [
  <HeadsetIcon key="h" className="size-6" />,
  <ShieldIcon key="s" className="size-6" />,
  <CheckIcon key="c" className="size-6" />,
  <BagIcon key="b" className="size-6" />,
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
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-white/20">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-fg">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-fg">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
