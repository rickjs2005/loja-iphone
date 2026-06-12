import type { ProductCategory } from "@/lib/data/types";

/**
 * ============================================================================
 *  TEXTOS DA VITRINE (white-label) — segunda fonte de personalização
 * ============================================================================
 *
 *  Tudo que é "voz da marca" no site público mora AQUI. Para adaptar a loja
 *  a um novo cliente, os três pontos de personalização são:
 *
 *    1. src/config/theme.config.ts ... cores, contatos e redes (via .env)
 *    2. src/config/copy.ts .......... ESTE arquivo (títulos, frases, CTAs)
 *    3. /public ..................... logo, vídeo do hero e imagens
 *
 *  Regra: componente NÃO tem texto de marketing hardcoded. Rótulos de UI
 *  ("Adicionar ao carrinho", mensagens de erro) ficam nos componentes —
 *  são produto, não marca, e valem para qualquer loja.
 *
 *  "{loja}" dentro de um texto é trocado pelo nome da loja (theme.config).
 * ============================================================================
 */

export const copy = {
  hero: {
    badge: "Pronta entrega · Garantia · Procedência",
    /** Linhas empilhadas; a última ganha o brilho "escovado". */
    headline: ["Seu próximo iPhone", "está aqui."],
    subtitle: "Novos, seminovos e com procedência garantida.",
    ctaPrimary: "Ver catálogo",
    /** Abre o formulário de avaliação do trade-in (lead direto do hero). */
    ctaSecondary: "Avaliar meu aparelho",
    /**
     * Prova de confiança sob os CTAs no mobile (no desktop o selo do topo
     * cumpre o papel). "{estoque}" vira o total real de unidades no banco —
     * prova dinâmica, não promessa.
     */
    trustLine: ["Garantia de 1 ano", "Loja física", "{estoque} aparelhos em estoque"],
  },

  /** Faixa de confiança sob o hero — mesma ordem dos ícones no componente. */
  trustBand: [
    { title: "Garantia", subtitle: "Cobertura real em todos os aparelhos" },
    { title: "Procedência", subtitle: "Originais e desbloqueados" },
    { title: "Bateria verificada", subtitle: "Testamos todos os aparelhos" },
    { title: "Envio rápido", subtitle: "Para todo o Brasil" },
  ],

  /** "Por que comprar aqui" — mesma ordem dos ícones no componente. */
  features: {
    eyebrow: "A loja",
    title: "Por que comprar na {loja}",
    subtitle: "Confiança não se promete, se entrega.",
    items: [
      {
        title: "Especialistas",
        text: "Time que respira Apple, do primeiro oi à pós-venda.",
      },
      {
        title: "Compra segura",
        text: "Aparelhos testados, com garantia e procedência.",
      },
      {
        title: "Pós-venda",
        text: "Suporte completo depois da compra, sem sumir.",
      },
      {
        title: "Loja física",
        text: "Endereço real para visitar, conferir e retirar.",
      },
    ],
  },

  /** Trade-in — mesma ordem dos ícones dos passos no componente. */
  tradeIn: {
    eyebrow: "Trocamos",
    title: "Seu iPhone usado vale crédito",
    text: "Seu iPhone atual vale crédito para o próximo. Avalie sem sair de casa.",
    steps: [
      "Conte o modelo e a bateria",
      "Receba a avaliação em minutos",
      "Use o crédito na sua compra",
    ],
    cta: "Avaliar meu aparelho",
  },

  /** Navegação por categoria e seções do catálogo na home. */
  categoryNav: { eyebrow: "Navegue", title: "Nossas categorias" },
  catalog: {
    eyebrow: "Catálogo",
    /** "{linha}" vira o plural da categoria (iPhones, MacBooks...). */
    lineTitle: "Destaques {linha}",
    lineSubtitles: {
      iphone:
        "Modelos disponíveis para entrega imediata. Finalize pelo WhatsApp em segundos.",
      macbook: "Desempenho para trabalhar e criar, com a garantia da loja.",
      ipad: "Tela grande para estudar, criar e assistir onde quiser.",
      accessory: "",
    } satisfies Record<ProductCategory, string>,
    emptyTitle: "Nossos produtos",
    emptySubtitle: "Em breve novos aparelhos por aqui.",
  },

  accessories: {
    eyebrow: "Acessórios",
    title: "Complete seu ecossistema",
    subtitle: "Capas, películas, carregadores e áudio para o seu iPhone.",
  },

  delivery: {
    eyebrow: "Entrega",
    title: "Entregas realizadas",
    subtitle: "Do nosso balcão até a sua mão — com rastreio para todo o Brasil.",
  },

  instagram: { eyebrow: "Instagram", title: "Acompanhe nosso Instagram" },

  /** Página de produto: cards de "Garantias e benefícios".
      O título do card de garantia vem do admin (warranty_text). */
  productBenefits: {
    heading: "Garantias e benefícios",
    warrantyFallbackTitle: "Garantia da loja",
    warrantyText: "Cobertura contra defeitos. Deu problema, a gente resolve.",
    items: [
      {
        title: "Bateria testada",
        text: "Saúde da bateria verificada e informada antes da compra.",
      },
      {
        title: "Procedência (IMEI)",
        text: "Origem verificada, sem bloqueio e com nota fiscal.",
      },
      {
        title: "Envio para todo Brasil",
        text: "Enviamos com rastreio para todo o país.",
      },
    ],
  },
} as const;

/** Troca "{loja}" pelo nome configurado (use com storeConfig.name). */
export function withStoreName(text: string, storeName: string): string {
  return text.replace("{loja}", storeName);
}
