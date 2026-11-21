import { createFileRoute } from "@tanstack/react-router";
import { Clock, Instagram, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { whatsappLink } from "@/lib/order";
import { STORE } from "@/lib/store-info";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e endereço — DJP Presentes Personalizados" },
      {
        name: "description",
        content: "Visite a DJP no Calçadão Salvador Isaia, 1263, Centro de Santa Maria – RS, ou chame no WhatsApp (55) 99949-8162.",
      },
      { property: "og:title", content: "Contato — DJP Presentes Personalizados" },
      { property: "og:description", content: "Calçadão Salvador Isaia, 1263 — Centro, Santa Maria – RS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contato,
});

function Contato() {
  const cards = [
    { icon: MapPin, title: "Endereço", body: `${STORE.address}\n${STORE.city} · CEP ${STORE.cep}`, href: STORE.mapsUrl, cta: "Abrir no mapa" },
    { icon: Clock, title: "Horário", body: STORE.hours, href: undefined, cta: "" },
    { icon: Instagram, title: "Instagram", body: `@${STORE.instagram}`, href: STORE.instagramUrl, cta: "Seguir" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <p className="eyebrow text-primary">Fale com a gente</p>
      <h1 className="mt-2 max-w-2xl text-4xl font-extrabold sm:text-5xl">Vamos criar o seu presente?</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Conte sua ideia pelo WhatsApp ou passe na loja, no centro de Santa Maria. Ajudamos a escolher o produto e criamos a
        arte com você.
      </p>
      <Button variant="whatsapp" size="xl" asChild className="mt-6">
        <a href={whatsappLink("Olá, DJP! Vim pelo site e gostaria de um orçamento.")} target="_blank" rel="noreferrer">
          <WhatsAppIcon className="h-5 w-5" /> {STORE.whatsappDisplay}
        </a>
      </Button>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-3xl bg-card p-6 shadow-soft">
            <c.icon className="h-6 w-6 text-accent" />
            <h2 className="mt-4 text-xl font-bold">{c.title}</h2>
            <p className="mt-1 whitespace-pre-line text-muted-foreground">{c.body}</p>
            {c.href && (
              <a href={c.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
                {c.cta} →
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl shadow-soft">
        <iframe
          title="Mapa da DJP Presentes Personalizados"
          src="https://www.google.com/maps?q=Cal%C3%A7ad%C3%A3o+Salvador+Isaia+1263+Santa+Maria+RS&output=embed"
          className="h-80 w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
