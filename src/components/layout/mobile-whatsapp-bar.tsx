import { buttonClasses } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/icons";
import { storeConfig } from "@/config/theme.config";

/** Barra fixa de conversão no mobile — some em lg+ (onde o FAB assume). */
export function MobileWhatsappBar() {
  const msg = encodeURIComponent(
    `Olá, ${storeConfig.name}! Vim pelo site e quero saber mais sobre os iPhones disponíveis.`,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bg/80 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
      <a
        href={`https://wa.me/${storeConfig.whatsapp}?text=${msg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("whatsapp", "md", "w-full")}
      >
        <WhatsappIcon className="size-5" />
        Falar no WhatsApp
      </a>
    </div>
  );
}
