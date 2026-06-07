"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { StarIcon, WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

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

function PhoneVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-[420px] sm:h-[520px] lg:h-[600px]"
    >
      {/* Orbe de luz grande atrás do aparelho */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[640px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,92,246,0.5),rgba(10,132,255,0.28)_38%,transparent_70%)] blur-2xl" />
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.5)]"
      >
        <Image
          src="/hero-iphone.png"
          alt="iPhone 17 Pro Max"
          fill
          priority
          sizes="(max-width: 1024px) 90vw, 620px"
          className="object-contain [-webkit-mask-image:radial-gradient(ellipse_70%_94%_at_center,#000_60%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_94%_at_center,#000_60%,transparent_100%)]"
        />
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
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Pronta entrega · Garantia · Procedência
            </motion.span>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-b from-white to-white/55 bg-clip-text text-transparent">
                Tecnologia premium.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0A84FF] via-[#6E5CF6] to-[#FF2D55] bg-clip-text text-transparent">
                Preço justo.
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted sm:text-xl lg:mx-0"
            >
              iPhones seminovos e lacrados com garantia. Entrega rápida e
              suporte especializado, do primeiro contato à pós-venda.
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
                Ver modelos disponíveis
              </a>
              <a
                href={`https://wa.me/${storeConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses(
                  "whatsapp",
                  "lg",
                  "h-14 px-8 text-base sm:text-lg",
                )}
              >
                <WhatsappIcon className="size-5" />
                Falar no WhatsApp
              </a>
            </motion.div>

            {/* Prova social */}
            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-8 flex items-center justify-center gap-3 lg:justify-start"
            >
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-5" />
                ))}
              </div>
              <span className="text-sm text-muted sm:text-base">
                <strong className="text-fg">+3.000</strong> aparelhos vendidos ·{" "}
                <strong className="text-fg">4,9</strong> de avaliação
              </span>
            </motion.div>
          </div>

          {/* Coluna do mockup 3D */}
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
