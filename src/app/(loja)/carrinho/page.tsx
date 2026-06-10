import type { Metadata } from "next";
import { CartPageClient } from "./cart-page-client";

// Wrapper server: a página em si é "use client" e não pode exportar metadata.
export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false },
};

export default function CarrinhoPage() {
  return <CartPageClient />;
}
