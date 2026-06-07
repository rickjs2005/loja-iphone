import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuroraBackground } from "@/components/visual/aurora-background";
import { MouseSpotlight } from "@/components/visual/mouse-spotlight";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Layout das rotas públicas: cabeçalho + conteúdo + rodapé. */
export default function LojaLayout({ children }: { children: ReactNode }) {
  const demo = !isSupabaseConfigured();

  return (
    <>
      <AuroraBackground />
      <MouseSpotlight />
      {demo && (
        <div className="bg-gradient-to-r from-primary/15 via-accent/15 to-[#FF2D55]/15 px-4 py-2 text-center text-xs text-fg/85">
          ✨ Demonstração — esta loja pode ser <strong>a sua</strong>: sua marca,
          suas cores, seus produtos e suas fotos.
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
      <CartDrawer />
    </>
  );
}
