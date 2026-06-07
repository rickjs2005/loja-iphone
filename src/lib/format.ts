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

/** 999900 -> "9999,00" (para campos de input em reais, sem o símbolo) */
export function centsToReaisInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}
