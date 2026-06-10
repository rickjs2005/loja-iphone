"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import { centsPorExtenso, formatCentsInput } from "@/lib/format";
import { ACCESSORY_CATEGORIES, CONDITIONS } from "@/lib/data/types";
import { cn } from "@/lib/cn";
import type { ProductRow } from "@/types/database.types";

export function ProductForm({ product }: { product?: ProductRow }) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    saveProductAction,
    {},
  );
  // Preço em CENTAVOS; o input visível mostra a máscara de moeda.
  const [priceCents, setPriceCents] = useState<number | null>(
    product ? product.price_cents : null,
  );
  const [category, setCategory] = useState<"iphone" | "accessory">(
    (product?.category as "iphone" | "accessory") ?? "iphone",
  );
  // Fotos só no cadastro (na edição quem cuida é o ImageManager).
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [reselectPhotos, setReselectPhotos] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const err = state.fieldErrors ?? {};
  // Após erro, a action ecoa o que foi digitado: o reset do React 19 aplica
  // o defaultValue ATUAL, então usar o eco evita perder o preenchido.
  const v = state.values;
  const isIphone = category === "iphone";

  // Libera as URLs de pré-visualização ao trocar a seleção / desmontar.
  useEffect(() => {
    return () => {
      photoPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoPreviews]);

  // Após erro do servidor o React reseta o form e o input de arquivos
  // esvazia: limpa os previews (que ficariam "fantasmas") e pede pra
  // selecionar as fotos de novo. O ref garante tratar cada erro uma vez só.
  const handledErrorRef = useRef<ProductFormState | null>(null);
  useEffect(() => {
    if (!state.error || handledErrorRef.current === state) return;
    handledErrorRef.current = state;
    if (photoPreviews.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoPreviews([]); // o cleanup acima revoga as URLs antigas
      setReselectPhotos(true);
    }
  }, [state, photoPreviews]);

  // Mensagem de sucesso (edição) some sozinha depois de alguns segundos.
  useEffect(() => {
    if (!state.ok) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [state]);

  function onPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Máscara de PDV: só dígitos; cada dígito digitado entra como centavo.
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPriceCents(digits ? Number(digits) : null);
  }

  function onSelectPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    setReselectPhotos(false);
    setPhotoPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return Array.from(e.target.files ?? []).map((f) =>
        URL.createObjectURL(f),
      );
    });
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="category" value={category} />

      {/* Seletor de tipo */}
      <div>
        <Label>Tipo de produto</Label>
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-1">
          {(["iphone", "accessory"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                category === c
                  ? "bg-primary text-white"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              {c === "iphone" ? "iPhone" : "Acessório"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={v?.name ?? product?.name}
          placeholder={isIphone ? "iPhone 15 Pro 256GB" : "Capa MagSafe transparente"}
        />
        <FieldError>{err.name?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={v?.description ?? product?.description ?? ""}
          placeholder="Detalhes, cor, condição, garantia..."
        />
        <FieldError>{err.description?.[0]}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            required
            value={formatCentsInput(priceCents)}
            onChange={onPriceChange}
            placeholder="R$ 0,00"
          />
          {/* O banco recebe sempre os CENTAVOS, via campo oculto. */}
          <input type="hidden" name="price_cents" value={priceCents ?? ""} />
          <FormHelp>
            {priceCents
              ? `Equivale a ${centsPorExtenso(priceCents)}.`
              : "Digite só números — cada dígito entra como centavo (3500 vira R$ 35,00)."}
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
            defaultValue={v?.stock ?? product?.stock ?? 0}
          />
          <FieldError>{err.stock?.[0]}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="installments">Parcelas no cartão (sem juros)</Label>
        <Input
          id="installments"
          name="installments"
          type="number"
          min={1}
          max={24}
          step={1}
          defaultValue={v?.installments ?? product?.installments ?? 12}
        />
        <FieldError>{err.installments?.[0]}</FieldError>
      </div>

      {/* Campos específicos de iPhone */}
      {isIphone && (
        <div className="grid gap-5 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="battery_health">Saúde da bateria (%)</Label>
            <Input
              id="battery_health"
              name="battery_health"
              type="number"
              min={0}
              max={100}
              step={1}
              defaultValue={v?.battery_health ?? product?.battery_health ?? ""}
              placeholder="100"
            />
            <FieldError>{err.battery_health?.[0]}</FieldError>
          </div>
          <div>
            <Label htmlFor="condition">Condição estética</Label>
            <select
              id="condition"
              name="condition"
              defaultValue={v?.condition ?? product?.condition ?? ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40"
            >
              <option value="">—</option>
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Campos específicos de Acessório */}
      {!isIphone && (
        <div>
          <Label htmlFor="accessory_category">Categoria do acessório</Label>
          <select
            id="accessory_category"
            name="accessory_category"
            defaultValue={
              v?.accessory_category ?? product?.accessory_category ?? "outros"
            }
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40"
          >
            {ACCESSORY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="sort_order">Ordem de exibição</Label>
        <Input
          id="sort_order"
          name="sort_order"
          type="number"
          min={0}
          step={1}
          defaultValue={v?.sort_order ?? product?.sort_order ?? 0}
        />
        <FormHelp>Menor número aparece primeiro.</FormHelp>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={v ? v.is_active === "on" : (product?.is_active ?? true)}
          className="size-5 rounded border-zinc-700 bg-zinc-950 text-primary accent-primary"
        />
        <span className="text-sm text-zinc-300">
          Produto ativo (visível na loja)
        </span>
      </label>

      {/* Fotos: só no cadastro. Na edição, o ImageManager assume. */}
      {!product && (
        <div>
          <Label htmlFor="images">Fotos (opcional)</Label>
          <input
            id="images"
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onSelectPhotos}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:brightness-110"
          />
          <FormHelp>
            JPG, PNG ou WebP, até 5 MB cada. Você poderá adicionar mais depois.
          </FormHelp>
          {reselectPhotos && (
            <p className="mt-2 text-sm text-amber-400">
              Selecione as fotos novamente.
            </p>
          )}
          {photoPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {photoPreviews.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt="Pré-visualização"
                  className="aspect-square w-full rounded-md object-cover opacity-80"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {state.error && <FieldError>{state.error}</FieldError>}
      {showSaved && (
        <p className="text-sm text-emerald-400">Alterações salvas com sucesso.</p>
      )}

      <div>
        <SubmitButton size="lg">
          {product ? "Salvar alterações" : "Criar produto"}
        </SubmitButton>
      </div>
    </form>
  );
}
