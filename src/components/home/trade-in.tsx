"use client";

import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { BoltIcon, CheckIcon, WhatsappIcon } from "@/components/ui/icons";
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

/**
 * Pulso de luz viajando por cima do feixe da foto (antigo → novo), em loop.
 * A foto dá o clima; o movimento dá a vida.
 */
function EnergyPulse() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[12%] top-1/2 -translate-y-1/2"
    >
      <motion.span
        className="absolute h-[3px] w-16 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_14px_3px_var(--store-primary)] blur-[0.5px]"
        animate={{ left: ["0%", "92%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
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
              {/* Foto: aparelho antigo → feixe de energia → aparelho novo */}
              <div className="relative w-full overflow-hidden rounded-2xl">
                <Image
                  src="/tradein.webp"
                  alt="iPhone antigo transferindo energia para um iPhone novo"
                  width={1600}
                  height={893}
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="h-auto w-full"
                />
                <EnergyPulse />
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
