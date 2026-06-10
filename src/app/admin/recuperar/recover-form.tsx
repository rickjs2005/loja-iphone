"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Input, Label, FieldError } from "@/components/ui/field";
import {
  recoverPasswordAction,
  type RecoverState,
} from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Enviar link de recuperação"}
    </button>
  );
}

export function RecoverForm() {
  const [state, formAction] = useActionState<RecoverState, FormData>(
    recoverPasswordAction,
    {},
  );

  // Resposta deliberadamente genérica: não confirmamos e-mails cadastrados.
  if (state.ok) {
    return (
      <p className="py-4 text-center text-sm leading-relaxed text-zinc-300">
        Se este e-mail tiver acesso, você receberá um link para redefinir a
        senha. Confira também a caixa de spam.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="voce@loja.com"
        />
      </div>

      <FieldError>{state.error}</FieldError>

      <SubmitButton />
    </form>
  );
}
