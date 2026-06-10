import "server-only";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Rate limiting da rota de login (e do pedido de reset de senha), por IP.
 *
 * Fonte da verdade: tabela `login_attempts` no Postgres, acessada SOMENTE
 * pelas funções RPC `login_rate_check/fail/reset` (security definer) — assim
 * o limite sobrevive a cold starts em serverless.
 *
 * LGPD: o IP nunca vai pro banco em claro — enviamos um SHA-256 de
 * `salt + chave`. O hash é estável (mesmo IP → mesma linha), mas não é
 * reversível para o endereço original.
 *
 * Fallback: sem Supabase configurado (modo demo) ou com o RPC fora do ar,
 * caímos no Map em memória (proteção básica, por instância).
 */

type Entry = { count: number; resetAt: number };

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos (mesma janela do SQL)
const MAX_ATTEMPTS = 5;

/** Salt fixo do código: impede correlacionar o hash com rainbow tables de IP. */
const IP_HASH_SALT = "loja-iphone:rate-limit:v1";

const memStore = new Map<string, Entry>();

export type RateResult = { allowed: boolean; retryAfterMs: number };

/** Chave (ex.: IP ou "reset:"+IP) → hash estável que vai pro banco. */
function hashKey(key: string): string {
  return createHash("sha256").update(`${IP_HASH_SALT}:${key}`).digest("hex");
}

// ---------------------------------------------------------------------------
// RPC — os tipos gerados (database.types.ts) não incluem essas funções, então
// chamamos via assinatura estrutural mínima e validamos o retorno.
// ---------------------------------------------------------------------------

type UntypedRpc = (
  fn: string,
  args?: Record<string, unknown>,
) => PromiseLike<{ data: unknown; error: { message: string } | null }>;

async function callRpc(fn: string, ipHash: string): Promise<unknown> {
  const supabase = await createClient();
  // Cast no CLIENT, não no método solto: extrair supabase.rpc perderia o
  // `this` e o supabase-js quebra ao acessar this.rest.
  const client = supabase as unknown as { rpc: UntypedRpc };
  const { data, error } = await client.rpc(fn, { p_ip_hash: ipHash });
  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// Fallback em memória (estado por instância; zera em cold start)
// ---------------------------------------------------------------------------

function memCheck(key: string, now: number): RateResult {
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }
  return { allowed: true, retryAfterMs: 0 };
}

function memFail(key: string, now: number): void {
  const entry = memStore.get(key);
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

function memReset(key: string): void {
  memStore.delete(key);
}

// ---------------------------------------------------------------------------
// Interface pública (mesmos nomes de antes; agora assíncrona)
// ---------------------------------------------------------------------------

/** Pode tentar logar? Não incrementa o contador. */
export async function checkLoginRate(key: string): Promise<RateResult> {
  if (isSupabaseConfigured()) {
    try {
      const data = (await callRpc("login_rate_check", hashKey(key))) as {
        allowed?: boolean;
        retry_after_ms?: number | string;
      } | null;
      if (data && typeof data.allowed === "boolean") {
        return {
          allowed: data.allowed,
          retryAfterMs: Number(data.retry_after_ms ?? 0),
        };
      }
    } catch {
      // RPC indisponível: cai no fallback em memória abaixo.
    }
  }
  return memCheck(key, Date.now());
}

/** Registra uma tentativa que falhou (abre/renova a janela de 15 min). */
export async function registerFailedAttempt(key: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await callRpc("login_rate_fail", hashKey(key));
      return;
    } catch {
      // RPC indisponível: registra no fallback em memória.
    }
  }
  memFail(key, Date.now());
}

/** Sucesso no login: zera o contador da chave. */
export async function resetLoginRate(key: string): Promise<void> {
  memReset(key); // limpa o fallback local em qualquer cenário
  if (!isSupabaseConfigured()) return;
  try {
    await callRpc("login_rate_reset", hashKey(key));
  } catch {
    // Sem drama: a janela expira sozinha em 15 minutos.
  }
}
