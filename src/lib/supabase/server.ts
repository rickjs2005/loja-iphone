import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Client do Supabase para uso no SERVIDOR (Server Components, Server Actions,
 * Route Handlers). A sessão vive em cookies httpOnly gerenciados pelo
 * @supabase/ssr.
 *
 * Em Server Components a escrita de cookies é ignorada (try/catch) — quem
 * renova a sessão é o middleware.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component: ignorar. O middleware cuida da
            // renovação dos cookies de sessão.
          }
        },
      },
    },
  );
}
