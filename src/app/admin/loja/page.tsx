import { SettingsForm } from "@/components/admin/settings-form";
import { SiteImageManager } from "@/components/admin/site-image-manager";
import { UnitsManager } from "@/components/admin/units-manager";
import { requireUser } from "@/lib/auth/user";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";
import { getUnits } from "@/lib/data/units";

export const dynamic = "force-dynamic";

export default async function AdminLojaPage() {
  await requireUser();
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
        Endereço, horário e fotos da loja física e da entrega. Aparecem na
        página inicial só quando você preenche.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Endereço, horário e garantia
        </h2>
        <SettingsForm settings={settings} />
      </section>

      <section className="mb-10">
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Unidades (lojas físicas)
        </h2>
        <p className="mb-4 text-sm text-zinc-500">
          Cadastre quando houver mais de um endereço — cada unidade aparece no
          site com endereço, horário e WhatsApp próprios, e o estoque passa a
          ser informado por unidade.
        </p>
        <UnitsManager units={units} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <SiteImageManager
          section="loja"
          title="Fotos da loja física"
          images={lojaImgs}
        />
        <SiteImageManager
          section="entrega"
          title="Fotos da entrega"
          images={entregaImgs}
        />
        <SiteImageManager
          section="instagram"
          title="Fotos do Instagram"
          images={instagramImgs}
        />
      </section>
    </div>
  );
}
