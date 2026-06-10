import { SettingsForm } from "@/components/admin/settings-form";
import { SiteImageManager } from "@/components/admin/site-image-manager";
import { UnitsManager } from "@/components/admin/units-manager";
import { requireAdmin } from "@/lib/auth/user";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";
import { getUnits } from "@/lib/data/units";

export const dynamic = "force-dynamic";

export default async function AdminLojaPage() {
  await requireAdmin();
  const [settings, units, lojaImgs, entregaImgs, instagramImgs] =
    await Promise.all([
      getStoreSettings(),
      getUnits(),
      getSiteImages("loja"),
      getSiteImages("entrega"),
      getSiteImages("instagram"),
    ]);

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-zinc-100">
        Conteúdo da loja
      </h1>
      <p className="mb-8 text-sm text-zinc-500">
        Tudo o que o cliente vê sobre a sua loja: endereço, horários, garantia
        e as fotos. O que você não preencher simplesmente não aparece no site.
      </p>

      <section className="mb-10">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Informações da loja
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Endereço e horário aparecem na seção &quot;Nossa loja&quot; e no
          rodapé; pagamento e garantia, nas páginas dos produtos.
        </p>
        <SettingsForm settings={settings} hasUnits={units.length > 0} />
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Unidades (lojas físicas)
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Para quem tem mais de um endereço. Cada unidade aparece no site com
          endereço, horário e WhatsApp próprios — e o estoque dos produtos
          passa a ser informado por unidade.
        </p>
        <UnitsManager units={units} />
      </section>

      <section>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Fotos do site
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Fotos reais vendem confiança. Cada galeria abastece uma seção da
          página inicial.
        </p>
        <div className="grid gap-6 lg:grid-cols-3">
          <SiteImageManager
            section="loja"
            title="Fotos da loja física"
            description='Aparecem no carrossel da seção "Nossa loja".'
            images={lojaImgs}
          />
          <SiteImageManager
            section="entrega"
            title="Fotos da entrega"
            description='Aparecem na seção "Como entregamos" — clientes recebendo o pedido.'
            images={entregaImgs}
          />
          <SiteImageManager
            section="instagram"
            title="Fotos do Instagram"
            description='Aparecem na faixa "Acompanhe nosso Instagram", antes do rodapé.'
            images={instagramImgs}
          />
        </div>
      </section>
    </div>
  );
}
