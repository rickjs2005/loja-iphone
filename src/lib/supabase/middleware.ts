import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database.types";

/**
 * Renova a sessão do Supabase a cada request e protege as rotas /admin/*.
 *
 * IMPORTANTE (segurança): usamos getUser(), que revalida o token no servidor
 * do Supabase — diferente de getSession(), que apenas lê o cookie e pode ser
 * forjado.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // MODO DEMO: sem Supabase, não há sessão a renovar. Deixa a loja pública
  // funcionar; o admin é tratado nas próprias páginas (requireUser).
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  // Sem sessão tentando acessar área administrativa → manda pro login.
  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Já logado tentando ver o login → manda pro painel.
  if (isLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/produtos";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
