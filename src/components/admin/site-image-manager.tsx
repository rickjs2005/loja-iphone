"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { FieldError, FormHelp } from "@/components/ui/field";
import { TrashIcon } from "@/components/ui/icons";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  uploadSiteImagesAction,
  deleteSiteImageAction,
  saveSiteImageCaptionAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import type { SiteImageRow } from "@/types/database.types";

/** Legenda opcional da foto — salva ao enviar (Enter ou botão). */
function CaptionForm({ image }: { image: SiteImageRow }) {
  const [state, formAction] = useActionState<SiteFormState, FormData>(
    saveSiteImageCaptionAction,
    {},
  );

  return (
    <form action={formAction} className="mt-1.5">
      <div className="flex gap-1.5">
        <input type="hidden" name="id" value={image.id} />
        <input
          type="text"
          name="caption"
          maxLength={120}
          defaultValue={image.caption ?? ""}
          placeholder="Legenda (opcional)"
          aria-label="Legenda da foto"
          className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-primary"
        />
        <SubmitButton
          variant="outline"
          size="sm"
          className="h-7 shrink-0 rounded-md px-2 text-xs"
          pendingLabel="..."
        >
          Salvar
        </SubmitButton>
      </div>
      {state.error && <FieldError>{state.error}</FieldError>}
    </form>
  );
}

/** Gerenciador de imagens de uma seção do site (loja física / entrega). */
export function SiteImageManager({
  section,
  title,
  images,
}: {
  section: "loja" | "entrega";
  title: string;
  images: SiteImageRow[];
}) {
  const [state, formAction] = useActionState<SiteFormState, FormData>(
    uploadSiteImagesAction,
    {},
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Depende de [state] (objeto novo a cada retorno da action): com
  // [state.ok], o segundo sucesso (true === true) não disparava e o input
  // mantinha os arquivos — reenvio duplicava as fotos.
  useEffect(() => {
    if (!state.ok) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return [];
    });
    if (inputRef.current) inputRef.current.value = "";
  }, [state]);

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="mb-4 font-semibold text-zinc-100">{title}</h3>

      {images.length > 0 ? (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((img) => (
            <div key={img.id}>
              <div className="group relative aspect-square overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
                <Image src={img.url} alt="" fill sizes="160px" className="object-cover" />
                <div className="pointer-events-none absolute inset-0 hidden bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                  <ConfirmDeleteButton
                    action={deleteSiteImageAction}
                    fields={{ id: img.id, url: img.url }}
                    title="Remover imagem?"
                    description="A foto será excluída desta seção."
                    confirmLabel="Remover"
                    triggerLabel="Remover imagem"
                    triggerClassName="inline-flex size-10 items-center justify-center rounded-full bg-red-500/90 text-white shadow-lg transition-colors hover:bg-red-500"
                  >
                    <TrashIcon className="size-5" />
                  </ConfirmDeleteButton>
                </div>
              </div>
              <CaptionForm image={img} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-zinc-500">Nenhuma imagem ainda.</p>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="section" value={section} />
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
