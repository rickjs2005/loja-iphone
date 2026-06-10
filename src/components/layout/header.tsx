import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/cart/cart-button";
import { buttonClasses } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

// Links âncora para as seções da home (navegação de flagship).
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "iPhones", href: "#linha-iphone" },
  { label: "MacBooks", href: "#linha-macbook" },
  { label: "iPads", href: "#linha-ipad" },
  { label: "Acessórios", href: "#acessorios" },
  { label: "Sobre nós", href: "#loja" },
  { label: "Contato", href: "#contato" },
];

/** Cabeçalho fixo: logo, navegação por âncoras (lg+), carrinho e CTA de WhatsApp. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={storeConfig.logoUrl}
            alt={storeConfig.name}
            width={400}
            height={120}
            priority
            className="h-10 w-auto"
          />
          <span className="sr-only">{storeConfig.name}</span>
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
          <a
            href={`https://wa.me/${storeConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("whatsapp", "sm", "rounded-full")}
          >
            <WhatsappIcon className="size-4" />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sr-only sm:hidden">Falar no WhatsApp</span>
          </a>
        </div>
      </Container>
    </header>
  );
}
