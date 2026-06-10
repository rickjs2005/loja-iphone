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
import type { ReactNode } from "react";

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <HeadsetIcon className="size-6" />,
    title: "Especialistas",
    text: "Time que respira Apple, do primeiro oi à pós-venda.",
  },
  {
    icon: <ShieldIcon className="size-6" />,
    title: "Compra segura",
    text: "Aparelhos testados, com garantia e procedência.",
  },
  {
    icon: <CheckIcon className="size-6" />,
    title: "Pós-venda",
    text: "Suporte completo depois da compra, sem sumir.",
  },
  {
    icon: <BagIcon className="size-6" />,
    title: "Loja física",
    text: "Endereço real para visitar, conferir e retirar.",
  },
];

/** Bloco "por que comprar aqui" — reforça confiança e valor. */
export function Features() {
  return (
    <section id="porque" className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="A loja"
            title={`Por que comprar na ${storeConfig.name}`}
            subtitle="Confiança não se promete, se entrega."
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
