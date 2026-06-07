import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Carousel } from "@/components/ui/carousel";
import type { SiteImageRow } from "@/types/database.types";

/** "Como entregamos": carrossel mostrando clientes recebendo seus aparelhos. */
export function DeliverySection({ images }: { images: SiteImageRow[] }) {
  if (images.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            title="Como entregamos"
            subtitle="Do nosso balcão até a sua mão — com rastreio para todo o Brasil."
          />
        </Reveal>
        <Reveal>
          <Carousel images={images} alt="Cliente recebendo o pedido" />
        </Reveal>
      </Container>
    </section>
  );
}
