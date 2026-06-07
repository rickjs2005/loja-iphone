import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { getCurrentUser } from "@/lib/auth/user";
import { logoutAction } from "@/lib/auth/actions";
import { storeConfig } from "@/config/theme.config";

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
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-surface/40 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin/produtos" className="flex items-center gap-2">
              <Image
                src={storeConfig.logoUrl}
                alt={storeConfig.name}
                width={400}
                height={120}
                className="h-8 w-auto"
              />
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
                admin
              </span>
            </Link>
            <Link
              href="/admin/produtos"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              Produtos
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              Ver loja ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-fg transition-colors hover:bg-white/5"
              >
                Sair
              </button>
            </form>
          </div>
        </Container>
      </header>

      <main className="flex-1 py-8">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
