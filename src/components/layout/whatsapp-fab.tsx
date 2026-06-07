"use client";

import { motion } from "framer-motion";
import { WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

/** Botão flutuante de WhatsApp, fixo, com anel pulsante. */
export function WhatsappFab() {
  const msg = encodeURIComponent(
    `Olá, ${storeConfig.name}! Vim pelo site e quero saber mais sobre os iPhones disponíveis.`,
  );

  return (
    <motion.a
      href={`https://wa.me/${storeConfig.whatsapp}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-lg shadow-[#25D366]/30"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
      <WhatsappIcon className="relative size-7" />
    </motion.a>
  );
}
