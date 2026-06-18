/**
 * Utilitários de CEP (Brasil) — máscara de digitação e busca de endereço
 * no ViaCEP. Usado no Admin pra preencher cidade/bairro/endereço sozinho
 * a partir do CEP, facilitando o cadastro de unidades.
 *
 * Observação: o ViaCEP é uma API pública e gratuita. A chamada acontece no
 * cliente (CORS liberado pelo serviço). Em produção, o host está liberado no
 * connect-src do CSP (next.config.ts).
 */

/** Máscara ao digitar: "31270010" → "31270-010" (máximo 8 dígitos). */
export function formatCep(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** CEP com 8 dígitos (válido em forma, não garante que existe). */
export function isCompleteCep(input: string): boolean {
  return input.replace(/\D/g, "").length === 8;
}

export type CepAddress = {
  city: string;
  neighborhood: string;
  street: string;
  state: string;
};

/**
 * Busca o endereço pelo CEP no ViaCEP. Retorna null se o CEP for incompleto,
 * não existir ou a rede falhar — o chamador decide a mensagem.
 */
export async function fetchAddressByCep(
  cep: string,
  signal?: AbortSignal,
): Promise<CepAddress | null> {
  const d = cep.replace(/\D/g, "");
  if (d.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`, { signal });
    if (!res.ok) return null;
    const data: {
      erro?: boolean;
      localidade?: string;
      bairro?: string;
      logradouro?: string;
      uf?: string;
    } = await res.json();
    if (data.erro) return null;
    return {
      city: data.localidade ?? "",
      neighborhood: data.bairro ?? "",
      street: data.logradouro ?? "",
      state: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
