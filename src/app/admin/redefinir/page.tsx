import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ResetForm } from "./reset-form";
import { tenant } from "@/config/tenant";

export const metadata: Metadata = { title: "Admin · Redefinir senha" };

/**
 * Destino do link do e-mail de recuperação (fluxo PKCE do @supabase/ssr):
 * chega como /admin/redefinir?code=... — o code é trocado por sessão na
 * Server Action, junto com a gravação da nova senha.
 */
export default async function RedefinirPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={tenant.logoUrl}
            alt={tenant.name}
            width={400}
            height={120}
            className="h-10 w-auto"
          />
          <h1 className="mt-6 text-lg font-semibold text-zinc-100">
            Redefinir senha
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Escolha a nova senha do painel.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          {code ? (
            <ResetForm code={code} />
          ) : (
            <div className="py-2 text-center">
              <p className="text-sm leading-relaxed text-zinc-300">
                Este link de recuperação é inválido ou está incompleto.
              </p>
              <Link
                href="/admin/recuperar"
                className="mt-4 inline-block text-sm font-medium text-primary transition-colors hover:brightness-110"
              >
                Pedir um novo link
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          <Link
            href="/admin/login"
            className="transition-colors hover:text-zinc-400"
          >
            ← Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
}
