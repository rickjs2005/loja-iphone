import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { CartButton } from "@/components/cart/cart-button";
import { storeConfig } from "@/config/theme.config";

/** Cabeçalho fixo com logo (do config), navegação e carrinho. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
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

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-fg sm:block"
          >
            Produtos
          </Link>
          <CartButton />
        </nav>
      </Container>
    </header>
  );
}
