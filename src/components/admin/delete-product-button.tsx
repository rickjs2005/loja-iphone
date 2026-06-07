"use client";

import { deleteProductAction } from "@/app/admin/produtos/actions";
import { TrashIcon } from "@/components/ui/icons";

/** Botão de excluir com confirmação. Submete o Server Action de exclusão. */
export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Excluir ${name}`}
        className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <TrashIcon className="size-4" />
      </button>
    </form>
  );
}
