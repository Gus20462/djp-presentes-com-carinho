import { Link } from "@tanstack/react-router";
import { Clock, Instagram, MapPin } from "lucide-react";
import { STORE } from "@/lib/store-info";
import { whatsappLink } from "@/lib/order";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-sm text-sm text-ink-foreground/70">
            Presentes, brindes e produtos personalizados para aniversários, casamentos, formaturas, eventos e datas
            comemorativas. Criamos a arte com você.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow text-ink-foreground/50">Loja</p>
          <p className="flex gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              {STORE.address}
              <br />
              {STORE.city} · CEP {STORE.cep}
            </span>
          </p>
          <p className="flex gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            {STORE.hours}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="eyebrow text-ink-foreground/50">Fale com a gente</p>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
            <WhatsAppIcon className="h-4 w-4" /> {STORE.whatsappDisplay}
          </a>
          <a href={STORE.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
            <Instagram className="h-4 w-4" /> @{STORE.instagram}
          </a>
          <div className="flex gap-4 pt-2">
            <Link to="/produtos" className="underline-offset-4 hover:underline">Produtos</Link>
            <Link to="/contato" className="underline-offset-4 hover:underline">Contato</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-xs text-ink-foreground/50">
        © {new Date().getFullYear()} {STORE.name}
      </div>
    </footer>
  );
}
