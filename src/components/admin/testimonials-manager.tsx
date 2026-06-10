"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input, Label, Textarea, FieldError, FormHelp } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { TrashIcon } from "@/components/ui/icons";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  addTestimonialAction,
  deleteTestimonialAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import type { TestimonialRow } from "@/types/database.types";

/** CRUD de depoimentos de clientes (exibidos na página do produto). */
export function TestimonialsManager({
  testimonials,
}: {
  testimonials: TestimonialRow[];
}) {
  const [state, formAction] = useActionState<SiteFormState, FormData>(
    addTestimonialAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const err = state.fieldErrors ?? {};
  const v = state.values;

  // No sucesso o React já reseta o form (inputs uncontrolled) — comportamento
  // desejado aqui. Só garantimos o reset também após navegações de cache.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      {testimonials.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {testimonials.map((t) => (
            <li
              key={t.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100">{t.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  “{t.text}”
                </p>
              </div>
              <ConfirmDeleteButton
                action={deleteTestimonialAction}
                fields={{ id: t.id }}
                title="Remover depoimento?"
                description={`O depoimento de ${t.name} sai da loja.`}
                confirmLabel="Remover"
                triggerLabel={`Remover depoimento de ${t.name}`}
                triggerClassName="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <TrashIcon className="size-4" />
              </ConfirmDeleteButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">
          Nenhum depoimento ainda. Sem depoimentos (e sem avaliação média), a
          seção de avaliações não aparece na loja.
        </p>
      )}

      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="t_name">Nome do cliente</Label>
          <Input
            id="t_name"
            name="name"
            defaultValue={v?.name ?? ""}
            placeholder="Carlos M."
          />
          <FieldError>{err.name?.[0]}</FieldError>
        </div>
        <div>
          <Label htmlFor="t_text">Depoimento</Label>
          <Textarea
            id="t_text"
            name="text"
            defaultValue={v?.text ?? ""}
            placeholder="Aparelho impecável, chegou rápido..."
          />
          <FormHelp>
            Copie do WhatsApp/Instagram do cliente (com autorização). Máx. 300
            caracteres.
          </FormHelp>
          <FieldError>{err.text?.[0]}</FieldError>
        </div>

        {state.error && <FieldError>{state.error}</FieldError>}

        <div>
          <SubmitButton variant="outline" pendingLabel="Salvando...">
            Adicionar depoimento
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
