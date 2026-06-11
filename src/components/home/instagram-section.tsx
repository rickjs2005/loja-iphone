import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { storeConfig } from "@/config/theme.config";
import { copy } from "@/config/copy";
import type { SiteImageRow } from "@/types/database.types";

/**
 * Faixa "Acompanhe nosso Instagram": grade de fotos quadradas que linkam para
 * o perfil da loja. Só aparece quando há fotos E o link do Instagram está
 * configurado no tema.
 */
export function InstagramSection({ images }: { images: SiteImageRow[] }) {
  const instagram = storeConfig.social.instagram;
  if (images.length === 0 || !instagram) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow={copy.instagram.eyebrow}
            title={copy.instagram.title}
            action={
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Ver no Instagram →
              </a>
            }
          />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
            {images.slice(0, 6).map((img) => (
              <a
                key={img.id}
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Instagram da loja"
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={img.url}
                  alt={img.caption ?? ""}
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay claro sutil no hover, reforçando que a foto é clicável */}
                <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
