import Link from "next/link";
import { Container } from "@/components/ui/container";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";
import { getStoreSettings } from "@/lib/data/site";
import { getUnits } from "@/lib/data/units";

// Títulos das colunas seguem o mesmo padrão tipográfico.
const colTitle = "text-xs font-semibold uppercase tracking-[0.2em] text-muted";
const colLink = "text-sm text-muted transition-colors hover:text-fg";

const INSTITUCIONAL: { label: string; href: string }[] = [
  { label: "Sobre nós", href: "#loja" },
  { label: "Por que comprar", href: "#porque" },
  { label: "Trocar meu iPhone", href: "#trocar" },
];

const CATEGORIAS: { label: string; href: string }[] = [
  { label: "iPhones", href: "#linha-iphone" },
  { label: "MacBooks", href: "#linha-macbook" },
  { label: "iPads", href: "#linha-ipad" },
  { label: "Acessórios", href: "#acessorios" },
];

/** Rodapé corporativo em 4 colunas — última camada de confiança da página. */
export async function Footer() {
  const { social, whatsapp, name, description } = storeConfig;
  // Buscas independentes em paralelo (getUnits é deduplicado via React.cache).
  const [settings, units] = await Promise.all([getStoreSettings(), getUnits()]);
  const ano = new Date().getFullYear();

  return (
    <footer id="contato" className="mt-auto border-t border-white/10 bg-surface/40">
      <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-4">
        {/* Col 1 — marca */}
        <div>
          <p className="font-semibold text-fg">{name}</p>
          <p className="mt-2 text-sm text-muted">{description}</p>
          <div className="mt-4 flex items-center gap-2">
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
        </div>

        {/* Col 2 — institucional */}
        <div>
          <p className={colTitle}>Institucional</p>
          <ul className="mt-4 space-y-2.5">
            {INSTITUCIONAL.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={colLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — categorias */}
        <div>
          <p className={colTitle}>Categorias</p>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIAS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={colLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — atendimento (só dados reais do admin) */}
        <div>
          <p className={colTitle}>Atendimento</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className={colLink}
              >
                Falar no WhatsApp
              </a>
            </li>
            {/* Com unidades cadastradas, lista uma a uma; senão, endereço único. */}
            {units.length > 0 ? (
              units.map((unit) => (
                <li key={unit.id}>
                  <p className="text-sm text-fg">{unit.name}</p>
                  {unit.address && (
                    <p className="text-xs text-muted">{unit.address}</p>
                  )}
                </li>
              ))
            ) : (
              settings.address && (
                <li className="text-sm text-muted">{settings.address}</li>
              )
            )}
            {settings.hours && (
              <li className="text-sm text-muted">{settings.hours}</li>
            )}
            {settings.warranty_text && (
              <li className="text-sm text-muted">{settings.warranty_text}</li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-6">
          <p className="text-center text-sm text-muted">
            © {ano} {name}. Todos os direitos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
}
