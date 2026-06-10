import { SettingsForm } from "@/components/admin/settings-form";
import { SiteImageManager } from "@/components/admin/site-image-manager";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { requireUser } from "@/lib/auth/user";
import {
  getSiteImages,
  getStoreSettings,
  getTestimonials,
} from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function AdminLojaPage() {
  await requireUser();
  const [settings, lojaImgs, entregaImgs, testimonials] = await Promise.all([
    getStoreSettings(),
    getSiteImages("loja"),
    getSiteImages("entrega"),
    getTestimonials(),
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
          Endereço, horário e números
        </h2>
        <SettingsForm settings={settings} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Depoimentos de clientes
        </h2>
        <TestimonialsManager testimonials={testimonials} />
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
