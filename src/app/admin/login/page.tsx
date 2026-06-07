import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { storeConfig } from "@/config/theme.config";

export const metadata: Metadata = { title: "Admin · Login" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src={storeConfig.logoUrl}
            alt={storeConfig.name}
            width={400}
            height={120}
            className="h-12 w-auto"
          />
          <h1 className="mt-6 text-xl font-bold text-fg">Painel da loja</h1>
          <p className="mt-1 text-sm text-muted">
            Entre para gerenciar seus produtos.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/60 p-6 backdrop-blur">
          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
