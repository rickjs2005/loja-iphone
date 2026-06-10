import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { buttonClasses } from "@/components/ui/button";
import type {
  SiteImageRow,
  StoreSettingsRow,
  UnitRow,
} from "@/types/database.types";

/**
 * "Nossa(s) loja(s)": carrossel de fotos da loja física + endereço/horário.
 * Com unidades cadastradas, o card único do settings dá lugar a um grid de
 * cards (um por unidade); sem unidades, o comportamento antigo é preservado.
 */
export function StoreSection({
  settings,
  images,
  units,
}: {
  settings: StoreSettingsRow;
  images: SiteImageRow[];
  units: UnitRow[];
}) {
  const hasUnits = units.length > 0;
  const hasInfo = Boolean(settings.address || settings.hours);
  if (images.length === 0 && !hasInfo && !hasUnits) return null;

  const plural = units.length > 1;

  return (
    <section id="loja" className="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={plural ? "Visite uma unidade" : "Visite"}
            title={plural ? "Nossas lojas" : "Nossa loja"}
            subtitle={
              plural
                ? "Lojas físicas de verdade, para você comprar com confiança."
                : "Loja física de verdade, para você comprar com confiança."
            }
          />
        </Reveal>

        {images.length > 0 && (
          <Reveal>
            <Carousel images={images} alt="Foto da loja" />
          </Reveal>
        )}

        {hasUnits ? (
          <Reveal>
            {/* Um card por unidade física cadastrada no admin. */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
                >
                  <p className="font-semibold text-fg">{unit.name}</p>
                  {(unit.address || unit.hours) && (
                    <div className="space-y-1">
                      {unit.address && (
                        <p className="text-sm text-muted">{unit.address}</p>
                      )}
                      {unit.hours && (
                        <p className="text-sm text-muted">{unit.hours}</p>
                      )}
                    </div>
                  )}
                  {(unit.maps_url || unit.whatsapp) && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      {unit.maps_url && (
                        <a
                          href={unit.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonClasses("outline", "sm")}
                        >
                          Ver no mapa
                        </a>
                      )}
                      {/* Só aparece se a unidade tem WhatsApp próprio. */}
                      {unit.whatsapp && (
                        <a
                          href={`https://wa.me/${unit.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonClasses("whatsapp", "sm")}
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        ) : (
          hasInfo && (
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
          )
        )}
      </Container>
    </section>
  );
}
