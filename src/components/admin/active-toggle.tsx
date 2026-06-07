"use client";

import { useOptimistic, useTransition } from "react";
import { toggleActiveAction } from "@/app/admin/produtos/actions";
import { cn } from "@/lib/cn";

/**
 * Interruptor Ativo/Inativo com feedback instantâneo (useOptimistic).
 * A UI muda na hora; o Server Action persiste e a revalidação confirma.
 */
export function ActiveToggle({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [optimistic, setOptimistic] = useOptimistic(active);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !optimistic;
    startTransition(async () => {
      setOptimistic(next);
      const fd = new FormData();
      fd.set("id", id);
      fd.set("next", String(next));
      await toggleActiveAction(fd);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={optimistic ? "Desativar produto" : "Ativar produto"}
      onClick={toggle}
      className="group inline-flex items-center gap-2"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          optimistic ? "bg-emerald-500/80" : "bg-zinc-700",
        )}
      >
        <span
          className={cn(
            "inline-block size-4 rounded-full bg-white shadow transition-transform",
            optimistic ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
      <span
        className={cn(
          "w-12 text-left text-xs font-medium",
          optimistic ? "text-emerald-400" : "text-zinc-500",
        )}
      >
        {optimistic ? "Ativo" : "Inativo"}
      </span>
    </button>
  );
}
