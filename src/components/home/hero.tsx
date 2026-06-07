"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax sutil: o brilho se move e some conforme rola.
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Brilhos de fundo com parallax */}
      <motion.div
        aria-hidden
        style={{ y: glowY, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-32 left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="absolute right-0 top-40 size-[360px] rounded-full bg-accent/20 blur-[120px]" />
      </motion.div>

      <Container className="relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center py-24 text-center sm:py-32"
        >
          <motion.span
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Pronta entrega · Garantia · {storeConfig.name}
          </motion.span>

          <motion.h1
            variants={item}
            className="max-w-3xl bg-gradient-to-b from-fg to-fg/60 bg-clip-text text-4xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-6xl"
          >
            O iPhone que você quer,
            <br className="hidden sm:block" /> com a confiança que você merece.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-balance text-base text-muted sm:text-lg"
          >
            {storeConfig.description}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a href="#produtos" className={buttonClasses("primary", "lg")}>
              Ver modelos disponíveis
            </a>
            <a
              href={`https://wa.me/${storeConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp", "lg")}
            >
              <WhatsappIcon className="size-5" />
              Falar no WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
