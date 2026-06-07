import Link from "next/link";
import { Container } from "@/components/ui/container";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";
import { getStoreSettings } from "@/lib/data/site";

/** Rodapé com endereço/horário (do admin), redes sociais e WhatsApp. */
export async function Footer() {
  const { social, whatsapp, name } = storeConfig;
  const settings = await getStoreSettings();
  const ano = 2026;

  return (
    <footer className="mt-auto border-t border-white/10 bg-surface/40">
      {(settings.address || settings.hours) && (
        <Container className="border-b border-white/10 py-6 text-sm text-muted">
          {settings.address && (
            <p>
              <span className="text-fg">Endereço:</span> {settings.address}
            </p>
          )}
          {settings.hours && (
            <p className="mt-1">
              <span className="text-fg">Horário:</span> {settings.hours}
            </p>
          )}
        </Container>
      )}
      <Container className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted">
          © {ano} {name}. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-2">
          {social.instagram && (
            <Link
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <InstagramIcon className="size-5" />
            </Link>
          )}
          <Link
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="inline-flex size-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-fg"
          >
            <WhatsappIcon className="size-5" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
