"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Label, FieldError, FormHelp } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  saveSettingsAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import type { StoreSettingsRow } from "@/types/database.types";

export function SettingsForm({
  settings,
  hasUnits = false,
}: {
  settings: StoreSettingsRow;
  /** Com unidades cadastradas, o endereço único abaixo sai do site. */
  hasUnits?: boolean;
}) {
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
      {hasUnits && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300/90">
          Você tem unidades cadastradas: no site valem os endereços e
          horários de cada unidade. Os campos de endereço e horário abaixo
          ficam guardados, mas não aparecem para o cliente.
        </p>
      )}
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
