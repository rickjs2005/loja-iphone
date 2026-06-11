import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuroraBackground } from "@/components/visual/aurora-background";
import { MouseSpotlight } from "@/components/visual/mouse-spotlight";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MotionProvider } from "@/components/visual/motion-provider";
import { UnitsProvider } from "@/components/whatsapp/units-context";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getUpsellAccessories } from "@/lib/data/products";
import { getUnits } from "@/lib/data/units";
import { coverImage } from "@/lib/data/types";

/** Layout das rotas públicas: cabeçalho + conteúdo + rodapé. */
export default async function LojaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const demo = !isSupabaseConfigured();

  // Buscas independentes em paralelo (getUnits é deduplicado via React.cache).
  const [accessories, units] = await Promise.all([
    getUpsellAccessories(),
    getUnits(),
  ]);

  // Acessórios em estoque para o upsell no carrinho (query já filtrada e
  // limitada no banco — antes pagávamos o catálogo inteiro em toda página).
  const upsellAccessories = accessories.map((p) => ({
    productId: p.id,
    name: p.name,
    priceCents: p.price_cents,
    imageUrl: coverImage(p)?.url ?? null,
    stock: p.stock,
    category: "accessory" as const,
  }));

  // Só as unidades com WhatsApp próprio atendem; com 2+, os CTAs perguntam
  // ao cliente em qual loja ele quer ser atendido.
  const attendingUnits = units
    .filter((u) => Boolean(u.whatsapp))
    .map((u) => ({
      id: u.id,
      name: u.name,
      city: u.city,
      whatsapp: u.whatsapp as string,
    }));

  return (
    <MotionProvider>
      <UnitsProvider units={attendingUnits}>
        <AuroraBackground />
        <MouseSpotlight />
        {demo && (
          <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs text-fg/85">
            ✨ Demonstração — esta loja pode ser <strong>a sua</strong>: sua
            marca, suas cores, seus produtos e suas fotos.
          </div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer accessories={upsellAccessories} />
      </UnitsProvider>
    </MotionProvider>
  );
}
