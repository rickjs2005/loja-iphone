import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Retorna o usuário autenticado (ou null). Usa getUser(), que revalida o token
 * no servidor do Supabase — nunca confie em getSession() para autorização.
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Garante sessão autenticada em Server Actions / páginas do admin.
 * Redireciona para o login se não houver usuário. Defesa em profundidade:
 * a RLS já bloqueia o banco, mas isto evita executar lógica à toa.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Garante sessão autenticada E presença na allow-list de admins
 * (public.admins, consultada via RPC is_admin — security definer, sem
 * argumentos, avalia o auth.uid() da sessão). Qualquer usuário fora da
 * allow-list volta pro login. A RLS continua sendo a defesa final.
 */
export async function requireAdmin() {
  const user = await requireUser();

  const supabase = await createClient();
  // Os tipos gerados (database.types.ts) não incluem a função is_admin;
  // chamada via assinatura estrutural mínima.
  const rpc = supabase.rpc as unknown as (
    fn: "is_admin",
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  const { data, error } = await rpc("is_admin");

  if (error || data !== true) redirect("/admin/login");
  return user;
}
