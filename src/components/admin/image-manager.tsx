"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldError, FormHelp } from "@/components/ui/field";
import { TrashIcon } from "@/components/ui/icons";
import {
  uploadImagesAction,
  deleteImageAction,
  type ProductFormState,
} from "@/app/admin/produtos/actions";
import type { ProductImageRow } from "@/types/database.types";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImageRow[];
}) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(
    uploadImagesAction,
    {},
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Limpa as URLs de preview e o input após upload bem-sucedido.
  useEffect(() => {
    if (state.ok) {
      // Sincroniza a UI com o resultado do Server Action (upload concluído).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviews((prev) => {
        prev.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [state.ok]);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Galeria atual */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-bg"
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
              <form
                action={deleteImageAction}
                onSubmit={(e) => {
                  if (!confirm("Remover esta imagem?")) e.preventDefault();
                }}
                className="absolute right-1.5 top-1.5"
              >
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="url" value={img.url} />
                <input type="hidden" name="productId" value={productId} />
                <button
                  type="submit"
                  aria-label="Remover imagem"
                  className="inline-flex size-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-red-500/80 group-hover:opacity-100"
                >
                  <TrashIcon className="size-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Nenhuma imagem ainda.</p>
      )}

      {/* Upload */}
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="productId" value={productId} />
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onSelect}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:brightness-110"
        />
        <FormHelp>JPG, PNG ou WebP, até 5 MB cada.</FormHelp>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="Pré-visualização"
                className="aspect-square w-full rounded-lg object-cover opacity-80"
              />
            ))}
          </div>
        )}

        <FieldError>{state.error}</FieldError>

        <SubmitButton variant="outline" pendingLabel="Enviando...">
          Enviar imagens
        </SubmitButton>
      </form>
    </div>
  );
}
