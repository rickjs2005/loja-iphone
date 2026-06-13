"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { focusRing } from "@/components/ui/button";
import { MenuIcon, XIcon } from "@/components/ui/icons";

type MenuLink = { label: string; href: string };

/**
 * Menu mobile (hambúrguer) — antes dele, categoria só se alcançava rolando.
 * Sheet em portal no <body> (transform em ancestral quebra position:fixed),
 * com Esc, clique no backdrop e scroll lock, como os demais modais.
 */
export function MobileMenu({ links }: { links: MenuLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        className={`inline-flex size-10 items-center justify-center rounded-full text-fg transition-colors hover:bg-white/5 lg:hidden ${focusRing}`}
      >
        <MenuIcon className="size-5" />
      </button>
      <AnimatePresence>
        {open && <MenuSheet links={links} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MenuSheet({
  links,
  onClose,
}: {
  links: MenuLink[];
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <m.nav
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong ml-auto flex h-full w-[78%] max-w-xs flex-col border-l border-white/10 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
            Menu
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className={`inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-fg ${focusRing}`}
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {links.map((link, i) => (
            <m.li
              key={link.href}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className={`block rounded-xl px-3 py-3 text-xl font-semibold tracking-tight text-fg transition-colors hover:bg-white/5 ${focusRing}`}
              >
                {link.label}
              </Link>
            </m.li>
          ))}
        </ul>
      </m.nav>
    </m.div>,
    document.body,
  );
}
