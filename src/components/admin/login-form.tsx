"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { Input, Label, FieldError } from "@/components/ui/field";
import { loginAction, type LoginState } from "@/lib/auth/actions";

function formatMMSS(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function SubmitButton({ lockedMs }: { lockedMs: number }) {
  const { pending } = useFormStatus();
  const locked = lockedMs > 0;

  return (
    <button
      type="submit"
      disabled={pending || locked}
      className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {locked ? (
        <span className="font-mono">Bloqueado · {formatMMSS(lockedMs)}</span>
      ) : pending ? (
        "Entrando..."
      ) : (
        "Entrar"
      )}
    </button>
  );
}

export function LoginForm() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin/produtos";
  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  // Contador regressivo do rate limit (tempo no estado; Date.now só em efeitos).
  const expiryRef = useRef(0);
  const [lockedMs, setLockedMs] = useState(0);

  useEffect(() => {
    if (state.retryAfterMs && state.retryAfterMs > 0) {
      expiryRef.current = Date.now() + state.retryAfterMs;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLockedMs(state.retryAfterMs);
    }
  }, [state]);

  useEffect(() => {
    const id = setInterval(() => {
      setLockedMs(Math.max(0, expiryRef.current - Date.now()));
    }, 500);
    return () => clearInterval(id);
  }, []);

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

      <SubmitButton lockedMs={lockedMs} />

      {lockedMs > 0 && (
        <p className="text-center text-xs text-zinc-500">
          Limite de tentativas atingido. Tente novamente em{" "}
          <span className="font-mono text-zinc-300">{formatMMSS(lockedMs)}</span>
          .
        </p>
      )}
    </form>
  );
}
