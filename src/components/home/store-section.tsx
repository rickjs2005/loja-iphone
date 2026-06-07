import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buttonClasses } from "@/components/ui/button";
import { PhoneIcon } from "@/components/ui/icons";
import type { SiteImageRow, StoreSettingsRow } from "@/types/database.types";

/** "Nossa loja": fotos da loja física + endereço/horário. */
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
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-fg sm:text-3xl">
              Nossa loja
            </h2>
            <p className="mt-2 text-muted">
              Loja física de verdade, para você comprar com confiança.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {images.map((img, i) => (
                <Reveal key={img.id} delay={i * 0.06}>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-surface">
                    <Image
                      src={img.url}
                      alt="Foto da loja"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {hasInfo && (
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <PhoneIcon className="size-5" />
                </div>
                {settings.address && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-fg">Endereço</p>
                    <p className="text-sm text-muted">{settings.address}</p>
                  </div>
                )}
                {settings.hours && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-fg">
                      Horário de funcionamento
                    </p>
                    <p className="text-sm text-muted">{settings.hours}</p>
                  </div>
                )}
                {settings.maps_url && (
                  <a
                    href={settings.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses("outline", "sm", "mt-1")}
                  >
                    Ver no mapa
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
