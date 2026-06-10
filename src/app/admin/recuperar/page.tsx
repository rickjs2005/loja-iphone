import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { RecoverForm } from "./recover-form";
import { tenant } from "@/config/tenant";

export const metadata: Metadata = { title: "Admin · Recuperar senha" };

export default function RecuperarPage() {
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
            Recuperar senha
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Informe o e-mail do administrador para receber o link.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <RecoverForm />
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
