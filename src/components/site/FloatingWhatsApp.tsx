import { useRouterState } from "@tanstack/react-router";
import { whatsappLink } from "@/lib/order";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function FloatingWhatsApp() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path.startsWith("/produto/") || path.startsWith("/carrinho")) return null;
  return (
    <a
      href={whatsappLink("Olá, DJP! Vim pelo site e gostaria de um orçamento.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
