"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";

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
    <motion.div
      // Última entrada da sequência de reveal: headline → subtítulo → botões → device.
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center"
    >
      {/* Luz monocromática grande atrás do aparelho */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[640px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_42%,transparent_70%)] blur-2xl" />
      {/* Flutuação muito sutil — presença, não distração */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="w-full max-w-[460px]"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-25px_rgba(0,0,0,0.7)]">
          {/* Nome versionado: trocar o vídeo = trocar o nome (evita cache). */}
          <video
            src="/hero-v3.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="iPhone 17 Pro em destaque"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden py-16 lg:py-0">
      {/* Partículas flutuando */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          {/* Coluna de texto */}
          <div className="text-center lg:text-left">
            <motion.span
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur sm:text-sm"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-fg/80" />
              Pronta entrega · Garantia · Procedência
            </motion.span>

            {/* Headline empilhada em 3 linhas — padrão flagship (Apple/Linear) */}
            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 text-[2.6rem] font-extrabold uppercase leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-6xl xl:text-7xl"
            >
              <span className={`block ${silverDrop}`}>Titânio.</span>
              <span className={`block ${silverDrop}`}>Performance.</span>
              <span className={`block ${silverBrush}`}>Inteligência.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mx-auto mt-6 max-w-xl text-balance text-lg font-normal text-muted sm:text-xl lg:mx-0"
            >
              iPhones originais com garantia, procedência e o melhor preço da
              região.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
            >
              <a
                href="#produtos"
                className={buttonClasses(
                  "primary",
                  "lg",
                  "h-14 px-8 text-base sm:text-lg",
                )}
              >
                Ver modelos
              </a>
              <a
                href="#trocar"
                className={buttonClasses(
                  "outline",
                  "lg",
                  "h-14 px-8 text-base sm:text-lg",
                )}
              >
                <PhoneIcon className="size-5" />
                Trocar meu iPhone
              </a>
            </motion.div>
          </div>

          {/* Coluna do device — foto premium em moldura */}
          <PhoneVisual />
        </div>
      </Container>

      {/* Indicador de scroll */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            className="size-1.5 rounded-full bg-white/70"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
