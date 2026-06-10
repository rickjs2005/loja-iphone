import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Só o /admin usa sessão (a loja é 100% pública). Restringir o
  // updateSession ao admin evita um round-trip de auth ao Supabase
  // (getUser ≈ 100-400ms de TTFB) em toda visita pública. O refresh do
  // cookie de sessão também só importa no admin, então é seguro.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclui estáticos, imagens, vídeo e fontes — sem isso, cada
     * range-request do vídeo do hero passaria pelo middleware.
     * A proteção de /admin/* acontece dentro de updateSession.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm|ico|woff2?|ttf)$).*)",
  ],
};
