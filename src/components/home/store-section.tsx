import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import { buttonClasses } from "@/components/ui/button";
import { ClockIcon, MapPinIcon, WhatsappIcon } from "@/components/ui/icons";
import { formatUnitAddress } from "@/lib/format";
import { storeConfig } from "@/config/theme.config";
import type {
  SiteImageRow,
  StoreSettingsRow,
  UnitRow,
} from "@/types/database.types";

/** Chip monocromático de ícone — mesmo vocabulário visual das features. */
function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-fg">
      {children}
    </span>
  );
}

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
  // Endereço composto dos campos estruturados (fallback no texto legado).
  const enderecoLoja = formatUnitAddress(settings);
  const hasInfo = Boolean(enderecoLoja || settings.hours);
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
              {units.map((unit) => {
                // Endereço estruturado (rua/número/bairro/cidade), com
                // fallback no campo livre legado.
                const endereco = formatUnitAddress(unit);
                return (
                <div
                  key={unit.id}
                  className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur"
                >
                  {/* Foto da fachada desta unidade (quando cadastrada) */}
                  {unit.photo_url && (
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={unit.photo_url}
                        alt={`Fachada da loja ${unit.name}`}
                        fill
                        sizes="(max-width: 1024px) 90vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className={`flex flex-1 flex-col gap-3 p-5 ${unit.photo_url ? "pt-2" : ""}`}>
                  <p className="font-semibold text-fg">{unit.name}</p>
                  {(endereco || unit.hours || settings.hours) && (
                    <div className="space-y-1.5">
                      {endereco && (
                        <p className="flex items-start gap-2 text-sm text-muted">
                          <MapPinIcon className="mt-0.5 size-3.5 shrink-0" />
                          {endereco}
                        </p>
                      )}
                      {/* Ponto de referência ("perto do shopping X"). */}
                      {unit.reference && (
                        <p className="text-xs text-muted">
                          Ref.: {unit.reference}
                        </p>
                      )}
                      {/* Horário próprio ou, na falta, o horário geral da loja
                          (redes costumam ter o mesmo horário em toda parte). */}
                      {(unit.hours ?? settings.hours) && (
                        <p className="flex items-start gap-2 text-sm text-muted">
                          <ClockIcon className="mt-0.5 size-3.5 shrink-0" />
                          {unit.hours ?? settings.hours}
                        </p>
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
                </div>
                );
              })}
            </div>
          </Reveal>
        ) : (
          hasInfo && (
            <Reveal>
              {/* Cartão de visita da loja: ícones, hierarquia clara e os dois
                  caminhos que importam — chegar até a loja ou chamar agora. */}
              <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:gap-12">
                  {enderecoLoja && (
                    <div className="flex items-start gap-3">
                      <InfoChip>
                        <MapPinIcon className="size-4" />
                      </InfoChip>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                          Endereço
                        </p>
                        <p className="mt-1 max-w-xs text-fg">{enderecoLoja}</p>
                        {settings.reference && (
                          <p className="mt-0.5 max-w-xs text-xs text-muted">
                            Ref.: {settings.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {settings.hours && (
                    <div className="flex items-start gap-3">
                      <InfoChip>
                        <ClockIcon className="size-4" />
                      </InfoChip>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                          Horário
                        </p>
                        <p className="mt-1 max-w-xs text-fg">{settings.hours}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:shrink-0">
                  {settings.maps_url && (
                    <a
                      href={settings.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses("outline", "md")}
                    >
                      <MapPinIcon className="size-4" />
                      Como chegar
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${settings.whatsapp ?? storeConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("whatsapp", "md")}
                  >
                    <WhatsappIcon className="size-4" />
                    Falar com a loja
                  </a>
                </div>
              </div>
            </Reveal>
          )
        )}
      </Container>
    </section>
  );
}
