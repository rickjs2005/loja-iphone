"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
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

/**
 * `true` quando a viewport tem ao menos `px` de largura. SSR-safe: o snapshot
 * do servidor é `false` (mobile-first) → no celular nunca baixa o vídeo.
 */
function useMinWidth(px: number) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(`(min-width: ${px}px)`);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(`(min-width: ${px}px)`).matches,
    () => false,
  );
}

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

function PhoneVisual({
  px,
  py,
}: {
  /** Posição normalizada do cursor (-0.5..0.5) vinda da seção. */
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  // Parallax de cursor: o device inclina e desliza levemente seguindo o mouse,
  // como um objeto físico flutuando sob luz. Spring suave = movimento de 60fps
  // sem "tremer". No toque (sem mouse) os valores ficam em 0 → device parado.
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [9, -9]), {
    stiffness: 80,
    damping: 18,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-7, 7]), {
    stiffness: 80,
    damping: 18,
  });
  const translateX = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), {
    stiffness: 60,
    damping: 20,
  });
  const translateY = useSpring(useTransform(py, [-0.5, 0.5], [-12, 12]), {
    stiffness: 60,
    damping: 20,
  });
  // Reflexo de vidro que varre a moldura conforme o cursor anda na horizontal.
  const glarePos = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);

  // O vídeo é DECORATIVO. No mobile ele NÃO é baixado: mostramos só o poster
  // (LCP leve, ~17 KB). Em telas sm+ o vídeo monta no cliente DEPOIS da
  // primeira pintura — zero custo na primeira dobra do celular, onde autoplay
  // forçaria baixar o arquivo inteiro em loop.
  const showVideo = useMinWidth(640);

  return (
    <m.div
      // Última entrada da sequência de reveal: headline → subtítulo → botões → device.
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      // min-w-0: sem isso o conteúdo do carrossel (slides lado a lado) força
      // a largura mínima da célula do grid e estoura a página no mobile.
      // perspective: dá profundidade real à inclinação 3D do device.
      className="relative flex min-w-0 items-center justify-center [perspective:1200px]"
    >
      {/* Luz ambiente grande atrás do aparelho (monocromática + toque da marca) */}
      <div className="absolute left-1/2 top-1/2 -z-10 size-[640px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_42%,transparent_70%)] blur-2xl" />
      <div className="absolute left-1/2 top-1/2 -z-10 size-[420px] max-w-[90vw] -translate-x-1/2 -translate-y-[42%] rounded-full bg-primary/15 blur-[120px]" />
      {/* Camada de parallax (segue o cursor) — separada da flutuação para os
          dois movimentos não disputarem a mesma propriedade `y`. */}
      <m.div
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full min-w-0 max-w-[460px] will-change-transform"
      >
        {/* Flutuação muito sutil — presença, não distração */}
        <m.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
        {/* Mobile: o vídeo é APOIO (~300px), não o protagonista — a primeira
            dobra entrega a mensagem + CTAs. No sm+ volta ao retrato grande. */}
        <div className="glass-rim relative h-[300px] w-full min-w-0 overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_50px_100px_-25px_rgba(0,0,0,0.75)] sm:h-auto sm:aspect-[4/5]">
          {showVideo ? (
            /* Nome versionado: trocar o vídeo = trocar o nome (evita cache). */
            <video
              // O React NÃO emite o atributo `muted` no HTML do servidor (bug
              // antigo do react-dom) e o iOS só dá autoplay em vídeo que já
              // nasce mudo — sem isto o iPhone mostrava o botão de play.
              ref={(el) => {
                if (!el) return;
                el.muted = true;
                el.play().catch(() => {
                  // Low Power Mode bloqueia autoplay: fica o poster, sem erro.
                });
              }}
              src="/hero-v5.mp4"
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
          ) : (
            /* Mobile (e primeira pintura no desktop): só o poster otimizado. */
            <Image
              src="/hero-poster.jpg"
              alt="iPhone em destaque"
              fill
              sizes="(max-width: 640px) 90vw, 460px"
              priority
              className="object-cover"
            />
          )}
          {/* Reflexo de vidro fixo: brilho diagonal no topo da moldura. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"
          />
          {/* Glare dinâmico: ponto de luz que segue o cursor pela superfície. */}
          <m.div
            aria-hidden
            style={{ left: glarePos }}
            className="pointer-events-none absolute top-0 h-full w-1/2 -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_60%)] mix-blend-screen max-lg:hidden"
          />
        </div>
        </m.div>
      </m.div>
    </m.div>
  );
}

export function Hero({ stockTotal = 0 }: { stockTotal?: number }) {
  // O item de estoque só entra quando o número impressiona (loja nova com
  // 3 aparelhos passaria a impressão contrária).
  const trustBits = copy.hero.trustLine.filter(
    (bit) => !bit.includes("{estoque}") || stockTotal >= 10,
  );

  // Posição do cursor na seção, normalizada (-0.5..0.5), que alimenta o
  // parallax do device. Fica em 0 no toque (nunca há mousemove) → sem custo.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  function onPointer(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      onMouseMove={onPointer}
      onMouseLeave={onLeave}
      className="relative flex items-center overflow-hidden py-8 sm:py-16 lg:min-h-[92vh] lg:py-0"
    >
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
              className="text-[3.1rem] font-extrabold leading-[0.95] tracking-[-0.05em] sm:mt-6 sm:text-7xl lg:text-[5.25rem] xl:text-8xl"
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
              {/* CTA único: catálogo. A avaliação de troca já tem botão
                  próprio na seção de trade-in (#trocar) logo abaixo. */}
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

          {/* Coluna do device — foto premium em moldura de vidro com parallax */}
          <PhoneVisual px={px} py={py} />
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
    </section>
  );
}
