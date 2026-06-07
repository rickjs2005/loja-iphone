"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { StarIcon, WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

// Posições fixas das partículas (determinístico → sem mismatch de hidratação).
const PARTICLES = [
  { x: "8%", y: "20%", s: 3, d: 0 },
  { x: "22%", y: "70%", s: 2, d: 1.2 },
  { x: "40%", y: "30%", s: 2, d: 0.5 },
  { x: "62%", y: "75%", s: 3, d: 2 },
  { x: "78%", y: "25%", s: 2, d: 0.8 },
  { x: "90%", y: "55%", s: 3, d: 1.6 },
  { x: "15%", y: "45%", s: 2, d: 2.4 },
  { x: "52%", y: "60%", s: 2, d: 0.3 },
];

const fade = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function PhoneParallax({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const spring = { stiffness: 120, damping: 16 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring);
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), spring);

  return (
    <div className="relative [perspective:1200px]">
      {/* Orbe de luz atrás do aparelho (profundidade) */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,92,246,0.45),rgba(10,132,255,0.25)_40%,transparent_70%)] blur-2xl" />

      <motion.div
        style={{ rotateX, rotateY, x, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[420px]"
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
        >
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="iPhone em destaque"
            className="block h-auto w-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      onMouseMove={onMove}
      className="relative overflow-hidden"
    >
      {/* Partículas flutuando */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{ left: p.x, top: p.y, width: p.s, height: p.s }}
            animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 5 + p.d, repeat: Infinity, delay: p.d, ease: "easeInOut" }}
          />
        ))}
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-6">
          {/* Coluna de texto */}
          <div className="text-center lg:text-left">
            <motion.span
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Pronta entrega · Garantia · Procedência
            </motion.span>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
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
              className="mx-auto mt-6 max-w-md text-balance text-base text-muted sm:text-lg lg:mx-0"
            >
              iPhones seminovos e lacrados com garantia. Entrega rápida e
              suporte especializado, do primeiro contato à pós-venda.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
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

            {/* Prova social */}
            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-7 flex items-center justify-center gap-3 lg:justify-start"
            >
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-4" />
                ))}
              </div>
              <span className="text-sm text-muted">
                <strong className="text-fg">+500</strong> clientes satisfeitos
              </span>
            </motion.div>
          </div>

          {/* Coluna do mockup */}
          <PhoneParallax mx={mx} my={my} />
        </div>
      </Container>
    </section>
  );
}
