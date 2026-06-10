"use client";

import type { ComponentType, SVGProps } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import {
  BoltIcon,
  CheckIcon,
  ChevronLeftIcon,
  WhatsappIcon,
} from "@/components/ui/icons";
import { IphoneRender } from "@/components/visual/iphone-render";
import { buildTradeInUrl } from "@/lib/whatsapp";

const STEPS: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
}[] = [
  { icon: WhatsappIcon, text: "Envie fotos pelo WhatsApp" },
  { icon: BoltIcon, text: "Receba a avaliação em minutos" },
  { icon: CheckIcon, text: "Use o crédito na sua compra" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Linha de energia entre o aparelho antigo e o novo: pulso de luz em loop. */
function EnergyLine() {
  return (
    <div aria-hidden className="relative flex flex-1 items-center px-2">
      {/* Track */}
      <div className="h-px w-full bg-white/10" />
      {/* Pulso viajando da esquerda (antigo) para a direita (novo) */}
      <motion.span
        className="absolute top-1/2 h-[2px] w-12 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_2px_var(--store-primary)] blur-[0.5px]"
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Seta no meio: sensação de upgrade */}
      <span className="absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-bg text-muted">
        <ChevronLeftIcon className="size-4 rotate-180" />
      </span>
    </div>
  );
}

/** Seção de trade-in — a principal geradora de leads da home. */
export function TradeIn() {
  return (
    <section id="trocar" className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {/* Luzes de fundo: um toque da cor da marca + brilho neutro */}
          <div className="absolute -left-20 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -right-20 top-0 size-[360px] rounded-full bg-white/[0.05] blur-[120px]" />

          <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2">
            {/* Visual: aparelho antigo → linha de energia → aparelho novo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: easeOut }}
              className="flex items-center justify-center"
            >
              <div className="flex w-full max-w-md items-center">
                {/* O antigo: menor e apagado (wrapper dimensiona o SVG h-full) */}
                <div className="aspect-[7/15] h-44 shrink-0 opacity-60">
                  <IphoneRender uid="tradein-old" colorway="graphite" />
                </div>
                <EnergyLine />
                {/* O novo: maior e em destaque */}
                <div className="aspect-[7/15] h-60 shrink-0 drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]">
                  <IphoneRender uid="tradein-new" colorway="natural" />
                </div>
              </div>
            </motion.div>

            {/* Texto + passos + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
              className="text-center lg:text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Trocamos
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                Seu iPhone usado vale crédito
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted lg:mx-0">
                Seu iPhone atual vale crédito para o próximo. Avalie sem sair
                de casa.
              </p>

              <ul className="mx-auto mt-8 flex max-w-md flex-col gap-4 text-left lg:mx-0">
                {STEPS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-fg">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-sm text-fg sm:text-base">{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href={buildTradeInUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses(
                  "whatsapp",
                  "lg",
                  "mt-10 h-14 px-8 text-base sm:text-lg",
                )}
              >
                <WhatsappIcon className="size-5" />
                Avaliar meu aparelho
              </a>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
