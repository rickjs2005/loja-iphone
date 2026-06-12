"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { CheckIcon, PhoneIcon } from "@/components/ui/icons";
import { TradeInForm } from "@/components/home/trade-in-form";
import { copy } from "@/config/copy";

// Posições fixas das partículas (determinístico → sem mismatch de hidratação).
const PARTICLES = [
  { x: "8%", y: "20%", s: 3, d: 0 },
  { x: "22%", y: "70%", s: 2, d: 1.2 },
  { x: "38%", y: "30%", s: 2, d: 0.5 },
  { x: "60%", y: "78%", s: 3, d: 2 },
  { x: "75%", y: "22%", s: 2, d: 0.8 },
  { x: "90%", y: "55%", s: 3, d: 1.6 },
  { x: "15%", y: "45%", s: 2, d: 2.4 },
  { x: "52%", y: "60%", s: 2, d: 0.3 },
  { x: "83%", y: "80%", s: 2, d: 1.1 },
  { x: "30%", y: "12%", s: 2, d: 1.9 },
];

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 0.1 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/** Branco → prata: gradiente vertical que dá o brilho "flagship". */
const silverDrop =
  "bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent";
/** Prata escovada horizontal — o luxo é monocromático; cor só nos CTAs. */
const silverBrush =
  "bg-gradient-to-r from-white/40 via-white/75 to-white/40 bg-clip-text text-transparent";

function PhoneVisual() {
  return (
    <m.div
      // Última entrada da sequência de reveal: headline → subtítulo → botões → device.
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      // min-w-0: sem isso o conteúdo do carrossel (slides lado a lado) força
      // a largura mínima da célula do grid e estoura a página no mobile.
      className="relative flex min-w-0 items-center justify-center"
    >
      {/* Luz monocromática grande atrás do aparelho */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[640px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_42%,transparent_70%)] blur-2xl" />
      {/* Flutuação muito sutil — presença, não distração */}
      <m.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="w-full min-w-0 max-w-[460px]"
      >
        {/* Mobile: o vídeo é APOIO (~300px), não o protagonista — a primeira
            dobra entrega a mensagem + CTAs. No sm+ volta ao retrato grande. */}
        <div className="relative h-[300px] w-full min-w-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-25px_rgba(0,0,0,0.7)] sm:h-auto sm:aspect-[4/5]">
          {/* Nome versionado: trocar o vídeo = trocar o nome (evita cache). */}
          <video
            src="/hero-v4.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            // Primeiro frame leve enquanto o vídeo carrega (melhora o LCP).
            poster="/hero-poster.jpg"
            aria-label="iPhone em destaque"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </m.div>
    </m.div>
  );
}

export function Hero({ stockTotal = 0 }: { stockTotal?: number }) {
  // CTA secundário abre o formulário de avaliação direto do hero — o lead
  // de troca não precisa rolar até a seção de trade-in.
  const [tradeInOpen, setTradeInOpen] = useState(false);

  // O item de estoque só entra quando o número impressiona (loja nova com
  // 3 aparelhos passaria a impressão contrária).
  const trustBits = copy.hero.trustLine.filter(
    (bit) => !bit.includes("{estoque}") || stockTotal >= 10,
  );

  return (
    <section className="relative flex items-center overflow-hidden py-8 sm:py-16 lg:min-h-[92vh] lg:py-0">
      {/* Partículas flutuando (só em telas grandes: no celular competem com
          o conteúdo e gastam bateria sem ninguém reparar nelas) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 max-sm:hidden">
        {PARTICLES.map((p, i) => (
          <m.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{
              duration: 5 + p.d,
              repeat: Infinity,
              delay: p.d,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Container className="relative w-full">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10">
          {/* Coluna de texto */}
          <div className="text-center lg:text-left">
            {/* Selo de confiança: só do sm pra cima — no mobile a primeira
                dobra é título + frase + CTAs + vídeo, sem ruído. */}
            <m.span
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur sm:inline-flex sm:text-sm"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-fg/80" />
              {copy.hero.badge}
            </m.span>

            {/* Headline empilhada — padrão flagship (Apple): frase curta,
                sentence case, produto como apoio. */}
            <m.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] sm:mt-6 sm:text-6xl lg:text-6xl xl:text-7xl"
            >
              {copy.hero.headline.map((line, i) => (
                <span
                  key={line}
                  // Última linha com o brilho "escovado"; as demais, prata.
                  className={`block ${i === copy.hero.headline.length - 1 ? silverBrush : silverDrop}`}
                >
                  {line}
                </span>
              ))}
            </m.h1>

            <m.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mx-auto mt-4 max-w-xl text-balance text-lg font-normal text-muted sm:mt-6 sm:text-xl lg:mx-0"
            >
              {copy.hero.subtitle}
            </m.p>

            <m.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-7 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row lg:justify-start"
            >
              {/* CTA duplo — dois públicos: quem compra (catálogo) e quem
                  troca (avaliação). Largura cheia no celular: empilhados com
                  larguras diferentes parecem desalinhados. */}
              <a
                href="#produtos"
                className={buttonClasses(
                  "primary",
                  "lg",
                  "h-14 w-full px-8 text-base sm:w-auto sm:text-lg",
                )}
              >
                {copy.hero.ctaPrimary}
              </a>
              <button
                type="button"
                onClick={() => setTradeInOpen(true)}
                className={buttonClasses(
                  "outline",
                  "lg",
                  "h-14 w-full px-8 text-base sm:w-auto sm:text-lg",
                )}
              >
                <PhoneIcon className="size-5" />
                {copy.hero.ctaSecondary}
              </button>
            </m.div>

            {/* Prova de confiança na primeira dobra do mobile (o selo do
                topo só existe no sm+) — decide os 3 primeiros segundos. */}
            <m.p
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] text-muted sm:hidden"
            >
              {trustBits.map((bit) => (
                <span key={bit} className="inline-flex items-center gap-1">
                  <CheckIcon className="size-3.5 shrink-0 text-primary" />
                  {bit.replace("{estoque}", String(stockTotal))}
                </span>
              ))}
            </m.p>
          </div>

          {/* Coluna do device — foto premium em moldura */}
          <PhoneVisual />
        </div>
      </Container>

      {/* Indicador de scroll */}
      <m.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <m.span
            className="size-1.5 rounded-full bg-white/70"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </m.div>

      <AnimatePresence>
        {tradeInOpen && <TradeInForm onClose={() => setTradeInOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
