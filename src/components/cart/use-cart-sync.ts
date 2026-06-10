"use client";

import { useEffect, useState } from "react";
import { syncCartAction } from "@/app/(loja)/carrinho/actions";
import { useCartStore } from "@/lib/cart/store";

/**
 * Debounce fora do persist: variável de módulo compartilhada entre drawer e
 * página — abrir um logo depois do outro não dispara duas idas ao servidor.
 */
let lastSyncAt = 0;
const SYNC_DEBOUNCE_MS = 15_000;
const NOTICE_MS = 5_000;

/**
 * Revalida preço/estoque dos itens do carrinho contra o servidor quando
 * `enabled` vira true (abrir o drawer / montar a página do carrinho).
 * Retorna se o aviso "atualizado agora" deve aparecer (some sozinho em ~5s).
 * Falha de rede é silenciosa: o carrinho segue usável com os dados locais.
 */
export function useCartSync(enabled: boolean): boolean {
  const [noticeVisible, setNoticeVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (Date.now() - lastSyncAt < SYNC_DEBOUNCE_MS) return;

    const ids = useCartStore.getState().items.map((i) => i.productId);
    if (ids.length === 0) return;
    lastSyncAt = Date.now();

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    syncCartAction(ids)
      .then((fresh) => {
        useCartStore.getState().syncWithServer(fresh);
        if (cancelled || !useCartStore.getState().lastSyncChanged) return;
        setNoticeVisible(true);
        timer = setTimeout(() => setNoticeVisible(false), NOTICE_MS);
      })
      .catch(() => {
        // Sync é melhoria de frescor, não requisito: falhou, segue o local.
      });

    return () => {
      // Fechar o drawer também derruba o aviso, senão ele "congela" visível.
      cancelled = true;
      if (timer) clearTimeout(timer);
      setNoticeVisible(false);
    };
  }, [enabled]);

  return noticeVisible;
}
