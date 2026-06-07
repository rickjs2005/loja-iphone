"use client";

import { useActionState, useState } from "react";
import {
  Input,
  Label,
  Textarea,
  FieldError,
  FormHelp,
} from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  saveProductAction,
  type ProductFormState,
} from "@/app/admin/produtos/actions";
import { formatCents } from "@/lib/format";
import type { ProductRow } from "@/types/database.types";

export function ProductForm({ product }: { product?: ProductRow }) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    saveProductAction,
    {},
  );
  const [priceCents, setPriceCents] = useState(
    product ? String(product.price_cents) : "",
  );

  const err = state.fieldErrors ?? {};
  const preview = Number(priceCents);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="iPhone 15 Pro 256GB"
        />
        <FieldError>{err.name?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          placeholder="Detalhes, cor, condição, garantia..."
        />
        <FieldError>{err.description?.[0]}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price_cents">Preço (em centavos)</Label>
          <Input
            id="price_cents"
            name="price_cents"
            type="number"
            min={0}
            step={1}
            required
            value={priceCents}
            onChange={(e) => setPriceCents(e.target.value)}
            placeholder="999900"
          />
          <FormHelp>
            {Number.isFinite(preview) && priceCents !== ""
              ? `Equivale a ${formatCents(preview)}`
              : "Ex.: 999900 = R$ 9.999,00"}
          </FormHelp>
          <FieldError>{err.price_cents?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={product?.stock ?? 0}
          />
          <FieldError>{err.stock?.[0]}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="sort_order">Ordem de exibição</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          min={0}
          step={1}
          defaultValue={product?.sort_order ?? 0}
        />
        <FormHelp>Menor número aparece primeiro na loja.</FormHelp>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={product?.is_active ?? true}
          className="size-5 rounded border-white/20 bg-bg text-primary accent-primary"
        />
        <span className="text-sm text-fg">
          Produto ativo (visível na loja)
        </span>
      </label>

      {state.error && <FieldError>{state.error}</FieldError>}
      {state.ok && (
        <p className="text-sm text-emerald-400">Alterações salvas com sucesso.</p>
      )}

      <div className="flex gap-3">
        <SubmitButton size="lg">
          {product ? "Salvar alterações" : "Criar produto"}
        </SubmitButton>
      </div>
    </form>
  );
}
