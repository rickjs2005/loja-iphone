"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BagIcon } from "@/components/ui/icons";
import { useCartStore, type CartItem } from "@/lib/cart/store";
import { useCartUI } from "@/lib/cart/ui-store";

type Props = {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "primary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "primary",
  size = "md",
  fullWidth,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUI((s) => s.open);
  const [added, setAdded] = useState(false);
  const esgotado = product.stock <= 0;

  function handleAdd() {
    addItem(product, quantity);
    openCart();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleAdd}
      disabled={esgotado}
      className={fullWidth ? "w-full" : undefined}
      aria-live="polite"
    >
      <BagIcon className="size-4" />
      {esgotado ? "Esgotado" : added ? "Adicionado!" : "Adicionar ao carrinho"}
    </Button>
  );
}
