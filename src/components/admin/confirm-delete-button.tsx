"use client";

import { useState, useTransition, type ReactNode } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TrashIcon } from "@/components/ui/icons";

/**
 * Botão de exclusão genérico: abre um modal de confirmação e dispara o Server
 * Action recebido por prop (com os campos informados como FormData).
 * Reutilizado para excluir produtos e imagens.
 */
export function ConfirmDeleteButton({
  action,
  fields,
  title,
  description,
  confirmLabel,
  triggerClassName,
  triggerLabel,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  title: string;
  description?: string;
  confirmLabel?: string;
  triggerClassName?: string;
  triggerLabel: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
      await action(fd);
      setOpen(false);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel}
        className={triggerClassName}
      >
        {children ?? <TrashIcon className="size-4" />}
      </button>
      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        loading={pending}
        onConfirm={handleConfirm}
        onCancel={() => !pending && setOpen(false)}
      />
    </>
  );
}
