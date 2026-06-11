"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Label, FieldError, FormHelp } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  saveUnitAction,
  deleteUnitAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import { formatUnitAddress } from "@/lib/format";
import type { UnitRow } from "@/types/database.types";

/**
 * Form de unidade, usado tanto para criar quanto para editar (campo oculto
 * "id" decide). Em edição, `onDone` fecha o form inline após salvar.
 */
function UnitForm({ unit, onDone }: { unit?: UnitRow; onDone?: () => void }) {
  const [state, formAction] = useActionState<SiteFormState, FormData>(
    saveUnitAction,
    {},
  );
  const [showSaved, setShowSaved] = useState(false);
  const err = state.fieldErrors ?? {};
  // Após erro, a action ecoa o que foi digitado: o reset do React 19 aplica
  // o defaultValue ATUAL, então usar o eco evita perder o preenchido.
  const v = state.values;

  // Sucesso: em edição fecha o form inline; em criação mostra a mensagem
  // temporária (some sozinha, padrão do settings-form).
  useEffect(() => {
    if (!state.ok) return;
    if (onDone) {
      onDone();
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 4000);
    return () => clearTimeout(timer);
  }, [state, onDone]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {unit && <input type="hidden" name="id" value={unit.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`unit-name-${unit?.id ?? "nova"}`}>
            Nome da unidade
          </Label>
          <Input
            id={`unit-name-${unit?.id ?? "nova"}`}
            name="name"
            required
            defaultValue={v?.name ?? unit?.name ?? ""}
            placeholder="Matriz"
          />
          <FormHelp>
            Título do card no site (ex.: Matriz, Centro, Loja Manhuaçu).
          </FormHelp>
          <FieldError>{err.name?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor={`unit-whatsapp-${unit?.id ?? "nova"}`}>WhatsApp</Label>
          <Input
            id={`unit-whatsapp-${unit?.id ?? "nova"}`}
            name="whatsapp"
            inputMode="numeric"
            defaultValue={v?.whatsapp ?? unit?.whatsapp ?? ""}
            placeholder="5533999999999"
          />
          <FormHelp>Só dígitos, com DDI (ex.: 5533999999999).</FormHelp>
          <FieldError>{err.whatsapp?.[0]}</FieldError>
        </div>
      </div>

      {/* Endereço estruturado: nenhum campo é obrigatório. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`unit-city-${unit?.id ?? "nova"}`}>Cidade</Label>
          <Input
            id={`unit-city-${unit?.id ?? "nova"}`}
            name="city"
            defaultValue={v?.city ?? unit?.city ?? ""}
            placeholder="Manhuaçu"
          />
          <FieldError>{err.city?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor={`unit-neighborhood-${unit?.id ?? "nova"}`}>
            Bairro
          </Label>
          <Input
            id={`unit-neighborhood-${unit?.id ?? "nova"}`}
            name="neighborhood"
            defaultValue={v?.neighborhood ?? unit?.neighborhood ?? ""}
            placeholder="Centro"
          />
          <FieldError>{err.neighborhood?.[0]}</FieldError>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <div>
          <Label htmlFor={`unit-street-${unit?.id ?? "nova"}`}>Endereço</Label>
          <Input
            id={`unit-street-${unit?.id ?? "nova"}`}
            name="street"
            defaultValue={v?.street ?? unit?.street ?? ""}
            placeholder="Av. Salime Nacif"
          />
          <FieldError>{err.street?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor={`unit-number-${unit?.id ?? "nova"}`}>Número</Label>
          <Input
            id={`unit-number-${unit?.id ?? "nova"}`}
            name="number"
            defaultValue={v?.number ?? unit?.number ?? ""}
            placeholder="120"
          />
          <FieldError>{err.number?.[0]}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor={`unit-reference-${unit?.id ?? "nova"}`}>
          Ponto de referência
        </Label>
        <Input
          id={`unit-reference-${unit?.id ?? "nova"}`}
          name="reference"
          defaultValue={v?.reference ?? unit?.reference ?? ""}
          placeholder="Em frente à praça da matriz"
        />
        <FieldError>{err.reference?.[0]}</FieldError>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`unit-hours-${unit?.id ?? "nova"}`}>
            Horário (opcional)
          </Label>
          <Input
            id={`unit-hours-${unit?.id ?? "nova"}`}
            name="hours"
            defaultValue={v?.hours ?? unit?.hours ?? ""}
            placeholder="Vazio = horário geral da loja"
          />
          <FormHelp>
            Deixe vazio para usar o horário geral — preencha só se esta
            unidade abre em horário diferente.
          </FormHelp>
          <FieldError>{err.hours?.[0]}</FieldError>
        </div>

        <div>
          <Label htmlFor={`unit-sort-${unit?.id ?? "nova"}`}>Ordem</Label>
          <Input
            id={`unit-sort-${unit?.id ?? "nova"}`}
            name="sort_order"
            type="number"
            min={0}
            step={1}
            defaultValue={v?.sort_order ?? unit?.sort_order ?? 0}
          />
          <FormHelp>Menor número aparece primeiro.</FormHelp>
          <FieldError>{err.sort_order?.[0]}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor={`unit-maps-${unit?.id ?? "nova"}`}>Link do Maps</Label>
        <Input
          id={`unit-maps-${unit?.id ?? "nova"}`}
          name="maps_url"
          type="url"
          defaultValue={v?.maps_url ?? unit?.maps_url ?? ""}
          placeholder="https://maps.google.com/..."
        />
        <FieldError>{err.maps_url?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor={`unit-photo-${unit?.id ?? "nova"}`}>
          Foto da fachada (opcional)
        </Label>
        {unit?.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={unit.photo_url}
            alt={`Foto atual de ${unit.name}`}
            className="mb-2 aspect-[4/3] w-40 rounded-md border border-zinc-800 object-cover"
          />
        )}
        <input
          id={`unit-photo-${unit?.id ?? "nova"}`}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white hover:file:brightness-110"
        />
        <FormHelp>
          Aparece no card desta unidade no site.
          {unit?.photo_url ? " Enviar outra substitui a atual." : ""}
        </FormHelp>
      </div>

      {state.error && <FieldError>{state.error}</FieldError>}
      {showSaved && (
        <p className="text-sm text-emerald-400">Alterações salvas com sucesso.</p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton>
          {unit ? "Salvar alterações" : "Adicionar unidade"}
        </SubmitButton>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

/**
 * Gerenciador das unidades físicas da loja.
 * O form de criação fica COLAPSADO atrás de um botão — quem tem uma loja só
 * não carrega um formulário aberto à toa; quem vai adicionar, abre na hora.
 */
export function UnitsManager({ units }: { units: UnitRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div className="max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      {units.length === 0 && !adding && (
        /* Estado vazio: explica o benefício e convida — sem form aberto. */
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-zinc-400">
            Sua loja tem mais de um endereço? Cadastre as unidades para cada
            uma aparecer no site com endereço, horário e WhatsApp próprios —
            e o estoque dos produtos passa a ser informado por unidade.
          </p>
          <p className="text-xs text-zinc-500">
            Tem um endereço só? Não precisa cadastrar nada: o endereço da
            seção acima já aparece no site.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110"
          >
            + Adicionar unidade
          </button>
        </div>
      )}

      {units.length > 0 && (
        <ul className="flex flex-col divide-y divide-zinc-800">
          {units.map((unit) =>
            editingId === unit.id ? (
              <li key={unit.id} className="py-4 first:pt-0 last:pb-0">
                <UnitForm unit={unit} onDone={() => setEditingId(null)} />
              </li>
            ) : (
              <li
                key={unit.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {unit.name}
                  </p>
                  {formatUnitAddress(unit) && (
                    <p className="truncate text-xs text-zinc-500">
                      {formatUnitAddress(unit)}
                    </p>
                  )}
                  {unit.whatsapp && (
                    <p className="truncate text-xs text-zinc-500">
                      WhatsApp: {unit.whatsapp}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(unit.id)}
                    className="rounded-lg border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    Editar
                  </button>
                  <ConfirmDeleteButton
                    action={deleteUnitAction}
                    fields={{ id: unit.id }}
                    title={`Excluir a unidade "${unit.name}"?`}
                    description="O estoque registrado nesta unidade será removido; o total dos produtos é preservado."
                    confirmLabel="Excluir"
                    triggerLabel={`Excluir unidade ${unit.name}`}
                    triggerClassName="inline-flex size-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      {/* Criação: colapsada atrás do botão; aberta, ganha título e Cancelar. */}
      {adding ? (
        <div className={units.length > 0 ? "mt-6 border-t border-zinc-800 pt-5" : ""}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Nova unidade
          </h3>
          <UnitForm onDone={() => setAdding(false)} />
        </div>
      ) : (
        units.length > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-5 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            + Adicionar unidade
          </button>
        )
      )}
    </div>
  );
}
