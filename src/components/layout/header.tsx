import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/cart/cart-button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { buttonClasses } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/icons";
import { WhatsappCta } from "@/components/whatsapp/whatsapp-cta";
import { genericMessage } from "@/lib/whatsapp";
import { storeConfig } from "@/config/theme.config";

// Links âncora para as seções da home. Com a "/" na frente funcionam de
// QUALQUER página (na página de produto, "#linha-iphone" puro não levava
// a lugar nenhum).
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "iPhones", href: "/#linha-iphone" },
  { label: "MacBooks", href: "/#linha-macbook" },
  { label: "iPads", href: "/#linha-ipad" },
  { label: "Acessórios", href: "/#acessorios" },
  { label: "Sobre nós", href: "/#loja" },
  { label: "Contato", href: "/#contato" },
];

// O menu mobile ganha também o atalho de trade-in (gerador de leads).
const MOBILE_LINKS = [
  ...NAV_LINKS.slice(0, 4),
  { label: "Trocar meu iPhone", href: "/#trocar" },
  ...NAV_LINKS.slice(4),
];

/** Cabeçalho fixo: logo, navegação por âncoras (lg+), carrinho e CTA de WhatsApp. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 pt-3">
      <Container>
        {/* Barra flutuante de vidro: translúcida, com borda iluminada (rim),
            reflexo especular superior e sombra suave de profundidade. */}
        <div className="glass glass-rim glass-spec flex h-16 items-center justify-between gap-4 rounded-[1.75rem] px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={storeConfig.logoUrl}
            alt={storeConfig.name}
            // Selo é quadrado; wordmark é horizontal. Declarar o ratio certo
            // evita distorção e CLS no carregamento.
            width={storeConfig.logoIsBadge ? 192 : 400}
            height={storeConfig.logoIsBadge ? 192 : 120}
            priority
            className={storeConfig.logoIsBadge ? "h-11 w-auto" : "h-10 w-auto"}
          />
          {/* Selo/símbolo não carrega o nome legível neste tamanho —
              o nome entra em texto ao lado. Wordmark aparece sozinho. */}
          {storeConfig.logoIsBadge ? (
            <span className="text-lg font-bold tracking-tight text-fg">
              {storeConfig.name}
            </span>
          ) : (
            <span className="sr-only">{storeConfig.name}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton />
          <WhatsappCta
            message={genericMessage()}
            className={buttonClasses("whatsapp", "sm", "rounded-full")}
          >
            <WhatsappIcon className="size-4" />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sr-only sm:hidden">Falar no WhatsApp</span>
          </WhatsappCta>
          <MobileMenu links={MOBILE_LINKS} />
          </div>
        </div>
      </Container>
    </header>
  );
}
