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
import { getStoreSettings } from "@/lib/data/site";
import { getUnits } from "@/lib/data/units";
import { coverImage } from "@/lib/data/types";
import { hasMatrizUnit } from "@/lib/format";
import { storeConfig } from "@/config/theme.config";

/** Layout das rotas públicas: cabeçalho + conteúdo + rodapé. */
export default async function LojaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const demo = !isSupabaseConfigured();

  // Buscas independentes em paralelo (todas deduplicadas via React.cache).
  const [accessories, units, settings] = await Promise.all([
    getUpsellAccessories(),
    getUnits(),
    getStoreSettings(),
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

  // Quem atende pelo WhatsApp: a MATRIZ (número das Informações da loja) +
  // as unidades com número próprio. Com 2+ opções, os CTAs perguntam ao
  // cliente em qual loja ele quer ser atendido.
  const unidadesAtendentes = units
    .filter((u) => Boolean(u.whatsapp))
    .map((u) => ({
      id: u.id,
      name: u.name,
      city: u.city,
      whatsapp: u.whatsapp as string,
    }));
  const attendingUnits =
    settings.whatsapp && unidadesAtendentes.length > 0 && !hasMatrizUnit(units)
      ? [
          {
            id: "matriz",
            name: "Matriz",
            city: settings.city,
            whatsapp: settings.whatsapp,
          },
          ...unidadesAtendentes,
        ]
      : unidadesAtendentes;

  return (
    <MotionProvider>
      <UnitsProvider
        units={attendingUnits}
        // Número geral: o do admin manda; o do white-label é só reserva.
        defaultPhone={settings.whatsapp ?? storeConfig.whatsapp}
      >
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
