import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuroraBackground } from "@/components/visual/aurora-background";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Layout das rotas públicas: cabeçalho + conteúdo + rodapé. */
export default function LojaLayout({ children }: { children: ReactNode }) {
  const demo = !isSupabaseConfigured();

  return (
    <>
      <AuroraBackground />
      {demo && (
        <div className="bg-accent/15 px-4 py-2 text-center text-xs text-accent">
          Modo demonstração · dados de exemplo. Configure o Supabase
          (.env.local) para usar de verdade.
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
