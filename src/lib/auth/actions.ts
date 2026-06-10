"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  loginSchema,
  recoverSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth.schema";
import {
  checkLoginRate,
  registerFailedAttempt,
  resetLoginRate,
} from "@/lib/auth/rate-limit";

export type LoginState = { error?: string; retryAfterMs?: number };

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

/**
 * Login do dono da loja. Server Action → proteção CSRF/origin nativa do Next.
 * Valida com Zod, aplica rate limit por IP e nunca revela qual campo falhou.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Modo demo: configure o Supabase (.env.local) para acessar o admin.",
    };
  }

  const ip = await clientIp();

  const rate = await checkLoginRate(ip);
  if (!rate.allowed) {
    return {
      error: "Muitas tentativas. Aguarde para tentar novamente.",
      retryAfterMs: rate.retryAfterMs,
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    await registerFailedAttempt(ip);
    return { error: "E-mail ou senha inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    await registerFailedAttempt(ip);
    return { error: "E-mail ou senha incorretos." };
  }

  await resetLoginRate(ip);

  const redirectTo = String(formData.get("redirect") || "/admin/produtos");
  // Só aceita caminhos internos do admin (evita open redirect).
  const safe = redirectTo.startsWith("/admin") ? redirectTo : "/admin/produtos";
  redirect(safe);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Recuperação de senha
// ---------------------------------------------------------------------------

export type RecoverState = {
  ok?: boolean;
  error?: string;
  retryAfterMs?: number;
};

/**
 * Pede o e-mail de recuperação. A resposta é SEMPRE a mesma, exista a conta
 * ou não — não confirmamos e-mails cadastrados (enumeração de usuários).
 * Reusa o rate limit do login com a chave prefixada ("reset:"+IP), então as
 * janelas de login e de reset são independentes.
 */
export async function recoverPasswordAction(
  _prev: RecoverState,
  formData: FormData,
): Promise<RecoverState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Modo demo: configure o Supabase (.env.local) para acessar o admin.",
    };
  }

  const key = `reset:${await clientIp()}`;

  const rate = await checkLoginRate(key);
  if (!rate.allowed) {
    return {
      error: "Muitas tentativas. Aguarde para tentar novamente.",
      retryAfterMs: rate.retryAfterMs,
    };
  }

  const parsed = recoverSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Informe um e-mail válido." };
  }

  // Cada envio consome a janela (5 por 15 min) — evita spam de e-mails.
  await registerFailedAttempt(key);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  // Erro proposital e silenciosamente ignorado: a resposta não pode variar
  // conforme o e-mail existir ou não.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/admin/redefinir`,
  });

  return { ok: true };
}

export type ResetPasswordState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  /** Link inválido/expirado: a UI oferece pedir um novo. */
  expired?: boolean;
};

/**
 * Define a nova senha. O link do e-mail chega em /admin/redefinir?code=...
 * (fluxo PKCE do @supabase/ssr): trocamos o code por uma sessão e, com ela,
 * atualizamos a senha. O code só funciona no MESMO navegador que pediu o
 * reset (o verifier fica num cookie) e é de uso único.
 */
export async function resetPasswordAction(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Modo demo: configure o Supabase (.env.local) para acessar o admin.",
    };
  }

  const code = String(formData.get("code") || "");
  if (!code) {
    return { expired: true, error: "Link inválido ou expirado." };
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    return {
      expired: true,
      error:
        "Este link expirou ou já foi usado. Peça um novo para continuar.",
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (updateError) {
    return {
      error:
        "Não foi possível salvar a nova senha. Escolha uma diferente da atual e tente de novo.",
    };
  }

  // Sessão criada na troca do code: segue logado direto pro painel.
  redirect("/admin/produtos");
}
