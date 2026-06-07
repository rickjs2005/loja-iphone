"use client";

import { useActionState } from "react";
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
  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          defaultValue={settings.address ?? ""}
          placeholder="Av. Exemplo, 123 — Centro, Cidade/UF"
        />
        <FieldError>{err.address?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="hours">Horário de funcionamento</Label>
        <Input
          id="hours"
          name="hours"
          defaultValue={settings.hours ?? ""}
          placeholder="Seg a Sex, 9h às 18h · Sáb, 9h às 13h"
        />
        <FieldError>{err.hours?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="payment_methods">Formas de pagamento</Label>
        <Input
          id="payment_methods"
          name="payment_methods"
          defaultValue={settings.payment_methods ?? ""}
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
          defaultValue={settings.maps_url ?? ""}
          placeholder="https://maps.google.com/..."
        />
        <FormHelp>Cole o link de compartilhamento da sua loja no Maps.</FormHelp>
        <FieldError>{err.maps_url?.[0]}</FieldError>
      </div>

      {state.ok && (
        <p className="text-sm text-emerald-400">Alterações salvas com sucesso.</p>
      )}

      <div>
        <SubmitButton size="lg">Salvar</SubmitButton>
      </div>
    </form>
  );
}
