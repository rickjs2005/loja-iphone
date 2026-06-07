"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loginSchema } from "@/lib/validation/auth.schema";
import {
  checkLoginRate,
  registerFailedAttempt,
  resetLoginRate,
} from "@/lib/auth/rate-limit";

export type LoginState = { error?: string };

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
  const now = Date.now();

  const rate = checkLoginRate(ip, now);
  if (!rate.allowed) {
    const min = Math.ceil(rate.retryAfterMs / 60000);
    return { error: `Muitas tentativas. Tente novamente em ${min} min.` };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    registerFailedAttempt(ip, now);
    return { error: "E-mail ou senha inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    registerFailedAttempt(ip, now);
    return { error: "E-mail ou senha incorretos." };
  }

  resetLoginRate(ip);

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
