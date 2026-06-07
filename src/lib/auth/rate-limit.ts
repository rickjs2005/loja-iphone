import "server-only";

/**
 * Rate limiting simples em memória para a rota de login (por IP).
 *
 * Observação: em ambientes serverless o estado é por instância e zera em cold
 * starts — é uma proteção básica contra força bruta, conforme o escopo. Para
 * garantias fortes, troque por um store compartilhado (ex.: Upstash Redis).
 */

type Entry = { count: number; resetAt: number };

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;

const store = new Map<string, Entry>();

export type RateResult = { allowed: boolean; retryAfterMs: number };

export function checkLoginRate(key: string, now: number): RateResult {
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }
  return { allowed: true, retryAfterMs: 0 };
}

export function registerFailedAttempt(key: string, now: number): void {
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function resetLoginRate(key: string): void {
  store.delete(key);
}
