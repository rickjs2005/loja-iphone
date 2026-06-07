import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/user";
import { logoutAction } from "@/lib/auth/actions";
import { tenant } from "@/config/tenant";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  // Páginas sem sessão (login) renderizam sem o chrome do admin.
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/admin/produtos" className="flex items-center gap-2">
              <Image
                src={tenant.logoUrl}
                alt={tenant.name}
                width={400}
                height={120}
                className="h-7 w-auto"
              />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                admin
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              <Link
                href="/admin/produtos"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                Produtos
              </Link>
              <Link
                href="/admin/loja"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                Conteúdo da loja
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Ver loja ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Navegação mobile */}
      <nav className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 sm:hidden">
        <Link
          href="/admin/produtos"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Produtos
        </Link>
        <Link
          href="/admin/loja"
          className="rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Conteúdo
        </Link>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
