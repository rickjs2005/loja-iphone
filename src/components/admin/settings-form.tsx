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
    <form
      action={formAction}
      className="flex max-w-2xl flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5"
    >
      {hasUnits && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300/90">
          Você tem unidades cadastradas: no site valem os endereços e
          WhatsApps de cada unidade (os campos abaixo viram a &quot;Matriz&quot;
          e o número reserva). O horário abaixo é o geral — vale para toda
          unidade sem horário próprio. O modo de estoque (único ou por
          unidade) fica na seção Unidades, logo abaixo.
        </p>
      )}

      <div>
        <Label htmlFor="whatsapp">WhatsApp da loja</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          inputMode="tel"
          defaultValue={v?.whatsapp ?? settings.whatsapp ?? ""}
          placeholder="(33) 99983-0475"
        />
        <FormHelp>
          Com DDD — pode digitar com máscara, +55 ou só dígitos; o sistema
          salva no formato certo. É o número dos botões do site
          {hasUnits
            ? " quando a unidade não tem número próprio."
            : "."}
        </FormHelp>
        <FieldError>{err.whatsapp?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="matriz-photo">Foto da fachada (opcional)</Label>
        {settings.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.photo_url}
            alt="Foto atual da matriz"
            className="mb-2 aspect-[4/3] w-40 rounded-md border border-zinc-800 object-cover"
          />
        )}
        <input
          id="matriz-photo"
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:brightness-110"
        />
        <FormHelp>
          Aparece no card da Matriz no site, junto das unidades.
          {settings.photo_url ? " Enviar outra substitui a atual." : ""}
        </FormHelp>
      </div>

      {/* Endereço estruturado — mesmo formato do cadastro de unidades. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            name="city"
            defaultValue={v?.city ?? settings.city ?? ""}
            placeholder="Manhuaçu"
          />
          <FieldError>{err.city?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            name="neighborhood"
            defaultValue={v?.neighborhood ?? settings.neighborhood ?? ""}
            placeholder="Centro"
          />
          <FieldError>{err.neighborhood?.[0]}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <Label htmlFor="street">Endereço</Label>
          <Input
            id="street"
            name="street"
            defaultValue={v?.street ?? settings.street ?? ""}
            placeholder="Av. Salime Nacif"
          />
          <FieldError>{err.street?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            name="number"
            defaultValue={v?.number ?? settings.number ?? ""}
            placeholder="120"
          />
          <FieldError>{err.number?.[0]}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="reference">Ponto de referência</Label>
        <Input
          id="reference"
          name="reference"
          defaultValue={v?.reference ?? settings.reference ?? ""}
          placeholder="Em frente à praça da matriz"
        />
        <FieldError>{err.reference?.[0]}</FieldError>
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
