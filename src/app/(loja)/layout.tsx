import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuroraBackground } from "@/components/visual/aurora-background";
import { MouseSpotlight } from "@/components/visual/mouse-spotlight";
import { WhatsappFab } from "@/components/layout/whatsapp-fab";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MotionProvider } from "@/components/visual/motion-provider";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getActiveProducts } from "@/lib/data/products";
import { coverImage } from "@/lib/data/types";

/** Layout das rotas públicas: cabeçalho + conteúdo + rodapé. */
export default async function LojaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const demo = !isSupabaseConfigured();

  // Acessórios em estoque para o upsell no carrinho.
  const upsellAccessories = (await getActiveProducts())
    .filter((p) => p.category === "accessory" && p.stock > 0)
    .slice(0, 6)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      priceCents: p.price_cents,
      imageUrl: coverImage(p)?.url ?? null,
      stock: p.stock,
      category: "accessory" as const,
    }));

  return (
    <MotionProvider>
      <AuroraBackground />
      <MouseSpotlight />
      {demo && (
        <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs text-fg/85">
          ✨ Demonstração — esta loja pode ser <strong>a sua</strong>: sua marca,
          suas cores, seus produtos e suas fotos.
        </div>
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
      <CartDrawer accessories={upsellAccessories} />
    </MotionProvider>
  );
}
