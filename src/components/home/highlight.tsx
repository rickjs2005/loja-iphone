"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { IphoneRender } from "@/components/visual/iphone-render";

/** Seção "Destaque" — momento emocional com um iPhone grande. */
export function Highlight() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {/* Luz de fundo */}
          <div className="absolute -left-20 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -right-20 top-0 size-[360px] rounded-full bg-accent/20 blur-[120px]" />

          <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-4">
            {/* Aparelho grande */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 mx-auto h-[380px] sm:h-[460px] lg:order-1"
            >
              <div className="h-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.6)]">
                <IphoneRender uid="highlight" colorway="natural" />
              </div>
            </motion.div>

            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="order-1 text-center lg:order-2 lg:text-left"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Destaque
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl">
                Titânio. Performance.
                <br />
                <span className="bg-gradient-to-r from-[#0A84FF] via-[#6E5CF6] to-[#FF2D55] bg-clip-text text-transparent">
                  Inteligência.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-muted lg:mx-0">
                Os modelos mais desejados do momento, com procedência garantida e
                o melhor custo-benefício da região.
              </p>
              <a
                href="#produtos"
                className={buttonClasses(
                  "primary",
                  "lg",
                  "mt-8 h-14 px-8 text-base sm:text-lg",
                )}
              >
                Explorar modelos
              </a>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
