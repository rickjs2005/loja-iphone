"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Input, Label, FieldError } from "@/components/ui/field";
import {
  resetPasswordAction,
  type ResetPasswordState,
} from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar nova senha"}
    </button>
  );
}

export function ResetForm({ code }: { code: string }) {
  const [state, formAction] = useActionState<ResetPasswordState, FormData>(
    resetPasswordAction,
    {},
  );

  // Code expirado ou já usado: sem o que fazer aqui — só pedir outro link.
  if (state.expired) {
    return (
      <div className="py-2 text-center">
        <p className="text-sm leading-relaxed text-zinc-300">{state.error}</p>
        <Link
          href="/admin/recuperar"
          className="mt-4 inline-block text-sm font-medium text-primary transition-colors hover:brightness-110"
        >
          Pedir um novo link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="code" value={code} />

      <div>
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Mínimo de 8 caracteres"
        />
        <FieldError>{state.fieldErrors?.password?.[0]}</FieldError>
      </div>

      <div>
        <Label htmlFor="confirm">Confirmar nova senha</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Repita a senha"
        />
        <FieldError>{state.fieldErrors?.confirm?.[0]}</FieldError>
      </div>

      <FieldError>{state.error}</FieldError>

      <SubmitButton />
    </form>
  );
}
