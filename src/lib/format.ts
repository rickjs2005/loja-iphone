/**
 * Formatação de valores para a UI. O banco guarda preços em CENTAVOS (inteiro);
 * só aqui convertemos para a representação em reais.
 */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 999900 -> "R$ 9.999,00" */
export function formatCents(cents: number): string {
  return brl.format(cents / 100);
}

/**
 * Máscara de moeda para inputs (padrão PDV: cada dígito digitado é um
 * centavo). null/vazio vira campo vazio. 350000 -> "R$ 3.500,00"
 */
export function formatCentsInput(cents: number | null): string {
  return cents === null ? "" : brl.format(cents / 100);
}

/**
 * Parcelamento padrão (12x sem juros). Arredonda pra CIMA pra parcela
 * exibida nunca somar menos que o total. 999900 -> "12x de R$ 833,25"
 */
export function formatInstallments(cents: number, parts = 12): string {
  return `${parts}x de ${formatCents(Math.ceil(cents / parts))}`;
}

// ---------------------------------------------------------------------------
// Valor por extenso (ajuda do form de preço contra erro de magnitude)
// ---------------------------------------------------------------------------

const EXT_UNIDADES = [
  "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis",
  "dezessete", "dezoito", "dezenove",
];
const EXT_DEZENAS = [
  "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
  "oitenta", "noventa",
];
const EXT_CENTENAS = [
  "", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
  "seiscentos", "setecentos", "oitocentos", "novecentos",
];

/** Por extenso de 1..999 ("trezentos e cinquenta"). */
function trioPorExtenso(n: number): string {
  if (n === 100) return "cem";
  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];
  if (centena) partes.push(EXT_CENTENAS[centena]);
  if (resto >= 20) {
    const unidade = resto % 10;
    partes.push(
      unidade
        ? `${EXT_DEZENAS[Math.floor(resto / 10)]} e ${EXT_UNIDADES[unidade]}`
        : EXT_DEZENAS[Math.floor(resto / 10)],
    );
  } else if (resto) {
    partes.push(EXT_UNIDADES[resto]);
  }
  return partes.join(" e ");
}

/** 350000 -> "três mil e quinhentos reais". Cobre até a casa dos milhões. */
export function centsPorExtenso(cents: number): string {
  const reais = Math.floor(cents / 100);
  const centavos = cents % 100;
  const partes: string[] = [];

  if (reais) {
    const milhoes = Math.floor(reais / 1_000_000);
    const milhares = Math.floor((reais % 1_000_000) / 1000);
    const resto = reais % 1000;
    const blocos: string[] = [];
    if (milhoes) {
      blocos.push(milhoes === 1 ? "um milhão" : `${trioPorExtenso(milhoes)} milhões`);
    }
    if (milhares) {
      blocos.push(milhares === 1 ? "mil" : `${trioPorExtenso(milhares)} mil`);
    }
    if (resto) blocos.push(trioPorExtenso(resto));
    partes.push(`${blocos.join(" e ")} ${reais === 1 ? "real" : "reais"}`);
  }
  if (centavos) {
    partes.push(
      `${trioPorExtenso(centavos)} ${centavos === 1 ? "centavo" : "centavos"}`,
    );
  }
  return partes.length ? partes.join(" e ") : "zero reais";
}
