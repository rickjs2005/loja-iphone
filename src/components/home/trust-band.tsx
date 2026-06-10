import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons";

const ITEMS = [
  "Garantia",
  "Procedência",
  "Aparelhos testados",
  "Envio para todo Brasil",
];

/** Faixa de confiança logo abaixo do hero. */
export function TrustBand() {
  return (
    <div className="border-y border-white/10 bg-white/[0.02]">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
        {ITEMS.map((item) => (
          <span key={item} className="flex items-center gap-2 text-sm text-muted">
            <CheckIcon className="size-4 text-fg/60" />
            {item}
          </span>
        ))}
      </Container>
    </div>
  );
}
