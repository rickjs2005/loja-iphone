import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { SiteImageRow } from "@/types/database.types";

/** "Como entregamos": fotos da entrega — reforça confiança. */
export function DeliverySection({ images }: { images: SiteImageRow[] }) {
  if (images.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-fg sm:text-3xl">
              Como entregamos
            </h2>
            <p className="mt-2 text-muted">
              Embalagem caprichada e envio com rastreio para todo o Brasil.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <Reveal key={img.id} delay={i * 0.06}>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-surface">
                <Image
                  src={img.url}
                  alt="Foto da entrega"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
