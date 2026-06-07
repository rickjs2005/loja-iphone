"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Label, FieldError } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { loginAction, type LoginState } from "@/lib/auth/actions";

export function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin/produtos";
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="redirect" value={redirect} />

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

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      <FieldError>{state.error}</FieldError>

      <SubmitButton size="lg" pendingLabel="Entrando..." className="mt-2 w-full">
        Entrar
      </SubmitButton>
    </form>
  );
}
