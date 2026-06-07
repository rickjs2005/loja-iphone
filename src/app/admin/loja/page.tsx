import { SettingsForm } from "@/components/admin/settings-form";
import { SiteImageManager } from "@/components/admin/site-image-manager";
import { requireUser } from "@/lib/auth/user";
import { getSiteImages, getStoreSettings } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function AdminLojaPage() {
  await requireUser();
  const [settings, lojaImgs, entregaImgs] = await Promise.all([
    getStoreSettings(),
    getSiteImages("loja"),
    getSiteImages("entrega"),
  ]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-fg">Conteúdo da loja</h1>
      <p className="mb-8 text-sm text-muted">
        Endereço, horário e fotos da loja física e da entrega. Aparecem na
        página inicial só quando você preenche.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Endereço e horário
        </h2>
        <SettingsForm settings={settings} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
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
      </section>
    </div>
  );
}
