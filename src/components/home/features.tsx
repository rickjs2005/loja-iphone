import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  BadgeCheckIcon,
  BoltIcon,
  HeadsetIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import type { ReactNode } from "react";

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <ShieldIcon className="size-6" />,
    title: "Garantia de verdade",
    text: "Todo aparelho acompanha garantia. Deu problema, a gente resolve.",
  },
  {
    icon: <BadgeCheckIcon className="size-6" />,
    title: "Procedência checada",
    text: "IMEI verificado e origem comprovada. Nada de aparelho bloqueado.",
  },
  {
    icon: <BoltIcon className="size-6" />,
    title: "Bateria saudável",
    text: "Saúde da bateria testada e informada antes da compra.",
  },
  {
    icon: <HeadsetIcon className="size-6" />,
    title: "Suporte especializado",
    text: "Atendimento humano no WhatsApp, do primeiro oi à pós-venda.",
  },
];

/** Bloco "por que comprar aqui" — reforça confiança e valor. */
export function Features() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            title="Por que comprar na iDemo"
            subtitle="Confiança não se promete, se entrega."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:border-white/20">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
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
