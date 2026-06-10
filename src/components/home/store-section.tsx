import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { buttonClasses } from "@/components/ui/button";
import type { SiteImageRow, StoreSettingsRow } from "@/types/database.types";

/** "Nossa loja": carrossel de fotos da loja física + endereço/horário. */
export function StoreSection({
  settings,
  images,
}: {
  settings: StoreSettingsRow;
  images: SiteImageRow[];
}) {
  const hasInfo = Boolean(settings.address || settings.hours);
  if (images.length === 0 && !hasInfo) return null;

  return (
    <section id="loja" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Visite"
            title="Nossa loja"
            subtitle="Loja física de verdade, para você comprar com confiança."
          />
        </Reveal>

        {images.length > 0 && (
          <Reveal>
            <Carousel images={images} alt="Foto da loja" />
          </Reveal>
        )}

        {hasInfo && (
          <Reveal>
            <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-12 gap-y-4">
                {settings.address && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Endereço
                    </p>
                    <p className="mt-1 text-fg">{settings.address}</p>
                  </div>
                )}
                {settings.hours && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Horário
                    </p>
                    <p className="mt-1 text-fg">{settings.hours}</p>
                  </div>
                )}
              </div>
              {settings.maps_url && (
                <a
                  href={settings.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("outline", "md", "shrink-0")}
                >
                  Ver no mapa
                </a>
              )}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
