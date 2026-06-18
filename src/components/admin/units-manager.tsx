"use client";

import { useActionState, useEffect, useState } from "react";
import { Input, Label, FieldError, FormHelp } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  saveUnitAction,
  deleteUnitAction,
  toggleUnitStockAction,
  type SiteFormState,
} from "@/app/admin/loja/actions";
import { formatUnitAddress } from "@/lib/format";
import { formatWhatsappDisplay, maskWhatsappInput } from "@/lib/phone";
import { formatCep, fetchAddressByCep, isCompleteCep } from "@/lib/cep";
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

  // Campos controlados pra dar superpoderes ao preenchimento: máscara de
  // WhatsApp ao vivo e auto-preenchimento de endereço pelo CEP. Os demais
  // campos seguem não-controlados (defaultValue) como antes.
  const [whatsapp, setWhatsapp] = useState(() =>
    maskWhatsappInput(v?.whatsapp ?? unit?.whatsapp ?? ""),
  );
  const [city, setCity] = useState(v?.city ?? unit?.city ?? "");
  const [neighborhood, setNeighborhood] = useState(
    v?.neighborhood ?? unit?.neighborhood ?? "",
  );
  const [street, setStreet] = useState(v?.street ?? unit?.street ?? "");
  const [cep, setCep] = useState("");
  const [cepStatus, setCepStatus] = useState<
    "idle" | "loading" | "ok" | "notfound"
  >("idle");

  // Busca no ViaCEP quando o CEP fica completo (8 dígitos) e preenche
  // cidade/bairro/endereço — sem sobrescrever número e ponto de referência.
  async function handleCep(raw: string) {
    const masked = formatCep(raw);
    setCep(masked);
    if (!isCompleteCep(masked)) {
      setCepStatus("idle");
      return;
    }
    setCepStatus("loading");
    const addr = await fetchAddressByCep(masked);
    if (!addr) {
      setCepStatus("notfound");
      return;
    }
    if (addr.city) setCity(addr.city);
    if (addr.neighborhood) setNeighborhood(addr.neighborhood);
    if (addr.street) setStreet(addr.street);
    setCepStatus("ok");
  }

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
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(maskWhatsappInput(e.target.value))}
            placeholder="(33) 99983-0475"
          />
          <FormHelp>
            Com DDD — vai sendo formatado enquanto você digita; o sistema
            salva no formato certo.
          </FormHelp>
          <FieldError>{err.whatsapp?.[0]}</FieldError>
        </div>
      </div>

      {/* Endereço estruturado: nenhum campo é obrigatório. */}
      {/* Atalho: busca por CEP preenche cidade, bairro e endereço sozinho. */}
      <div className="sm:max-w-[12rem]">
        <Label htmlFor={`unit-cep-${unit?.id ?? "nova"}`}>
          CEP (preenche o endereço)
        </Label>
        <Input
          id={`unit-cep-${unit?.id ?? "nova"}`}
          inputMode="numeric"
          autoComplete="postal-code"
          value={cep}
          onChange={(e) => handleCep(e.target.value)}
          placeholder="36900-000"
          aria-describedby={`unit-cep-help-${unit?.id ?? "nova"}`}
        />
        <p
          id={`unit-cep-help-${unit?.id ?? "nova"}`}
          className="mt-1.5 text-xs"
          aria-live="polite"
        >
          {cepStatus === "loading" ? (
            <span className="text-zinc-400">Buscando endereço…</span>
          ) : cepStatus === "ok" ? (
            <span className="text-emerald-400">
              Endereço preenchido — confira o número.
            </span>
          ) : cepStatus === "notfound" ? (
            <span className="text-amber-400">
              CEP não encontrado — preencha à mão.
            </span>
          ) : (
            <span className="text-zinc-400">
              Digite o CEP e preenchemos cidade, bairro e rua.
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`unit-city-${unit?.id ?? "nova"}`}>Cidade</Label>
          <Input
            id={`unit-city-${unit?.id ?? "nova"}`}
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
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
            value={street}
            onChange={(e) => setStreet(e.target.value)}
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
export function UnitsManager({
  units,
  trackStockByUnit = false,
}: {
  units: UnitRow[];
  /** Modo de estoque: por unidade (ligado) ou único/compartilhado. */
  trackStockByUnit?: boolean;
}) {
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
                      WhatsApp: {formatWhatsappDisplay(unit.whatsapp)}
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

      {units.length > 0 && (
        <p className="mt-4 text-xs text-zinc-500">
          Dica: cadastre a matriz também como uma unidade chamada
          &quot;Matriz&quot; para ela ter WhatsApp, endereço e foto próprios
          — ela substitui o card automático do site.
        </p>
      )}

      {/* Modo de estoque: a maioria das redes compartilha o estoque entre
          as lojas (faltou numa, a outra envia) — por isso nasce desligado. */}
      {units.length > 0 && (
        <form
          action={toggleUnitStockAction}
          className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
        >
          <input
            type="hidden"
            name="enabled"
            value={trackStockByUnit ? "0" : "1"}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100">
              Estoque por unidade:{" "}
              <span className={trackStockByUnit ? "text-emerald-400" : "text-zinc-400"}>
                {trackStockByUnit ? "ligado" : "desligado"}
              </span>
            </p>
            <p className="mt-1 max-w-md text-xs text-zinc-500">
              {trackStockByUnit
                ? "Você informa quanto tem em cada loja no cadastro do produto; o site soma o total sozinho."
                : "Estoque único e compartilhado entre as lojas (faltou numa, a outra envia). Ligue se quiser informar quanto tem em cada uma."}
            </p>
          </div>
          <SubmitButton variant="outline" size="sm" pendingLabel="...">
            {trackStockByUnit ? "Desligar" : "Ligar"}
          </SubmitButton>
        </form>
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
