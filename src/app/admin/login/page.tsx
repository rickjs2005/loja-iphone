import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { tenant } from "@/config/tenant";

export const metadata: Metadata = { title: "Admin · Login" };

export default function LoginPage() {
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
            Painel da loja
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Acesso restrito ao administrador.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          {tenant.name} · painel administrativo
        </p>
      </div>
    </main>
  );
}
