"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Label, FieldError, FormHelp } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  saveSettingsAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import type { StoreSettingsRow } from "@/types/database.types";

export function SettingsForm({ settings }: { settings: StoreSettingsRow }) {
  const [state, formAction] = useActionState<SiteFormState, FormData>(
    saveSettingsAction,
    {},
  );
  const [showSaved, setShowSaved] = useState(false);
  const err = state.fieldErrors ?? {};
  // Após erro, a action ecoa o que foi digitado: o reset do React 19 aplica
  // o defaultValue ATUAL, então usar o eco evita reverter pros valores antigos.
  const v = state.values;

  // Mensagem de sucesso some sozinha depois de alguns segundos.
  useEffect(() => {
    if (!state.ok) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={v?.address ?? settings.address ?? ""}
          placeholder="Av. Exemplo, 123 — Centro, Cidade/UF"
        />
        <FieldError>{err.address?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="hours">Horário de funcionamento</Label>
        <Input
          id="hours"
          name="hours"
          defaultValue={v?.hours ?? settings.hours ?? ""}
          placeholder="Seg a Sex, 9h às 18h · Sáb, 9h às 13h"
        />
        <FieldError>{err.hours?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="payment_methods">Formas de pagamento</Label>
        <Input
          id="payment_methods"
          name="payment_methods"
          defaultValue={v?.payment_methods ?? settings.payment_methods ?? ""}
          placeholder="Pix, cartão em até 12x e dinheiro"
        />
        <FormHelp>Aparece nas páginas dos produtos.</FormHelp>
        <FieldError>{err.payment_methods?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="maps_url">Link do Google Maps (opcional)</Label>
        <Input
          id="maps_url"
          name="maps_url"
          type="url"
          defaultValue={v?.maps_url ?? settings.maps_url ?? ""}
          placeholder="https://maps.google.com/..."
        />
        <FormHelp>Cole o link de compartilhamento da sua loja no Maps.</FormHelp>
        <FieldError>{err.maps_url?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="warranty_text">Garantia</Label>
        <Input
          id="warranty_text"
          name="warranty_text"
          defaultValue={v?.warranty_text ?? settings.warranty_text ?? ""}
          placeholder="Garantia de 90 dias"
        />
        <FormHelp>
          Aparece na página dos produtos. Vazio mostra um texto genérico.
        </FormHelp>
        <FieldError>{err.warranty_text?.[0]}</FieldError>
      </div>

      {/* Números reais da loja — prova social. Vazio = a seção some do site. */}
      <fieldset className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Números da loja (prova social)
        </legend>
        <FormHelp>
          Use apenas números REAIS. Campos vazios não aparecem na loja.
        </FormHelp>
        <div className="mt-3 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="stat_sold">Aparelhos vendidos</Label>
            <Input
              id="stat_sold"
              name="stat_sold"
              type="number"
              min={0}
              step={1}
              defaultValue={v?.stat_sold ?? settings.stat_sold ?? ""}
              placeholder="3000"
            />
            <FieldError>{err.stat_sold?.[0]}</FieldError>
          </div>
          <div>
            <Label htmlFor="stat_satisfaction">Satisfação (%)</Label>
            <Input
              id="stat_satisfaction"
              name="stat_satisfaction"
              type="number"
              min={0}
              max={100}
              step={1}
              defaultValue={
                v?.stat_satisfaction ?? settings.stat_satisfaction ?? ""
              }
              placeholder="98"
            />
            <FieldError>{err.stat_satisfaction?.[0]}</FieldError>
          </div>
          <div>
            <Label htmlFor="stat_rating">Avaliação média (0 a 5)</Label>
            <Input
              id="stat_rating"
              name="stat_rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              defaultValue={v?.stat_rating ?? settings.stat_rating ?? ""}
              placeholder="4.9"
            />
            <FieldError>{err.stat_rating?.[0]}</FieldError>
          </div>
          <div>
            <Label htmlFor="stat_reviews">Número de avaliações</Label>
            <Input
              id="stat_reviews"
              name="stat_reviews"
              type="number"
              min={0}
              step={1}
              defaultValue={v?.stat_reviews ?? settings.stat_reviews ?? ""}
              placeholder="312"
            />
            <FieldError>{err.stat_reviews?.[0]}</FieldError>
          </div>
        </div>
      </fieldset>

      {state.error && <FieldError>{state.error}</FieldError>}
      {showSaved && (
        <p className="text-sm text-emerald-400">Alterações salvas com sucesso.</p>
      )}

      <div>
        <SubmitButton size="lg">Salvar</SubmitButton>
      </div>
    </form>
  );
}
