"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldError, FormHelp } from "@/components/ui/field";
import { TrashIcon } from "@/components/ui/icons";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
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

  useEffect(() => {
    if (state.ok) {
      // Limpa previews após upload concluído.
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
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-md border border-zinc-800 bg-zinc-950"
            >
              <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
              {/* dim no hover (desktop) */}
              <div className="pointer-events-none absolute inset-0 hidden bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
              {/* botão de excluir centralizado: sempre no mobile, hover no desktop */}
              <div className="absolute inset-0 flex items-center justify-center transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <ConfirmDeleteButton
                  action={deleteImageAction}
                  fields={{ imageId: img.id, url: img.url, productId }}
                  title="Remover imagem?"
                  description="A foto será excluída do produto."
                  confirmLabel="Remover"
                  triggerLabel="Remover imagem"
                  triggerClassName="inline-flex size-10 items-center justify-center rounded-full bg-red-500/90 text-white shadow-lg transition-colors hover:bg-red-500"
                >
                  <TrashIcon className="size-5" />
                </ConfirmDeleteButton>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Nenhuma imagem ainda.</p>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="productId" value={productId} />
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onSelect}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:brightness-110"
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
                className="aspect-square w-full rounded-md object-cover opacity-80"
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
