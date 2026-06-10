/**
 * ============================================================================
 *  FONTE ÚNICA DE PERSONALIZAÇÃO (WHITE-LABEL)
 * ============================================================================
 *
 *  Para adaptar a loja a um novo cliente, edite APENAS este arquivo e troque
 *  o logo em /public. Nada de mexer em componentes.
 *
 *  - name......: nome exibido no cabeçalho, título da aba e mensagens.
 *  - logoUrl...: caminho do logo dentro de /public (ex: "/logo.svg").
 *  - whatsapp..: somente dígitos, com DDI 55 (ex: "5533999999999").
 *  - social....: links das redes (deixe "" para esconder).
 *  - colors....: viram CSS variables no :root e são consumidas pelo Tailwind.
 *
 *  As cores aceitam qualquer formato CSS válido (hex, rgb, hsl).
 * ============================================================================
 */

export type StoreColors = {
  bg: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
};

export type StoreConfig = {
  name: string;
  description: string;
  logoUrl: string;
  whatsapp: string;
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
  colors: StoreColors;
};

/**
 * Lê uma variável de ambiente, caindo no fallback quando vazia.
 *
 * IMPORTANTE: cada `process.env.NEXT_PUBLIC_*` precisa ser referenciado de forma
 * ESTÁTICA (literal) para o Next inlinar o valor no bundle do client. Por isso
 * cada chave aparece escrita por extenso abaixo — não dá para fazer em loop.
 */
const v = (value: string | undefined, fallback: string) =>
  value && value.trim() !== "" ? value : fallback;

/**
 * Revenda white-label: defina estas variáveis no deploy de cada loja (ex.: na
 * Vercel) para personalizar SEM tocar no código. Se não definir, usa os
 * defaults abaixo (a loja "iDemo"). O logo continua sendo o arquivo em
 * /public (troque-o ou aponte NEXT_PUBLIC_STORE_LOGO_URL para outro caminho).
 */
export const storeConfig: StoreConfig = {
  name: v(process.env.NEXT_PUBLIC_STORE_NAME, "iDemo"),
  description: v(
    process.env.NEXT_PUBLIC_STORE_DESCRIPTION,
    "Os melhores iPhones da região, com garantia e procedência.",
  ),
  logoUrl: v(process.env.NEXT_PUBLIC_STORE_LOGO_URL, "/logo.svg"),
  whatsapp: v(process.env.NEXT_PUBLIC_STORE_WHATSAPP, "5533999999999"),
  social: {
    instagram: v(process.env.NEXT_PUBLIC_STORE_INSTAGRAM, ""),
    facebook: v(process.env.NEXT_PUBLIC_STORE_FACEBOOK, ""),
    tiktok: v(process.env.NEXT_PUBLIC_STORE_TIKTOK, ""),
  },
  colors: {
    bg: v(process.env.NEXT_PUBLIC_COLOR_BG, "#050505"),
    surface: v(process.env.NEXT_PUBLIC_COLOR_SURFACE, "#0B0B0B"),
    primary: v(process.env.NEXT_PUBLIC_COLOR_PRIMARY, "#0A84FF"),
    accent: v(process.env.NEXT_PUBLIC_COLOR_ACCENT, "#6E5CF6"),
    text: v(process.env.NEXT_PUBLIC_COLOR_TEXT, "#FFFFFF"),
    muted: v(process.env.NEXT_PUBLIC_COLOR_MUTED, "#A1A1AA"),
  },
};
