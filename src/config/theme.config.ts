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

export const storeConfig: StoreConfig = {
  name: "iDemo",
  description: "Os melhores iPhones da região, com garantia e procedência.",
  logoUrl: "/logo.svg",
  whatsapp: "5533999999999",
  social: {
    instagram: "https://instagram.com/",
    facebook: "",
    tiktok: "",
  },
  colors: {
    bg: "#0A0A0B",
    surface: "#141416",
    primary: "#3B82F6",
    accent: "#A855F7",
    text: "#FAFAFA",
    muted: "#A1A1AA",
  },
};
