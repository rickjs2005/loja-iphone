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
