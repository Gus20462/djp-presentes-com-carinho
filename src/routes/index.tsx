import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, MessageCircle, Palette, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { CATEGORIES, getProduct, OCCASIONS, PRODUCTS } from "@/lib/catalog";
import { productImage } from "@/lib/product-images";
import { whatsappLink } from "@/lib/order";
import { STORE } from "@/lib/store-info";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DJP Presentes Personalizados — Santa Maria, RS" },
      {
        name: "description",
        content:
          "Canecas, camisetas, azulejos, brindes e lembranças personalizadas em Santa Maria – RS. Personalize online e peça pelo WhatsApp.",
      },
      { property: "og:title", content: "DJP Presentes Personalizados" },
      { property: "og:description", content: "Presentes com a sua cara. Personalize online e peça pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const HERO_TILES = [
  { key: "caneca-personalizada", tilt: "-6deg", cls: "left-[4%] top-[6%] w-[38%]", delay: "0s" },
  { key: "raglan-branca", tilt: "5deg", cls: "right-[4%] top-0 w-[34%]", delay: "1.2s" },
  { key: "caneca-pessoa-favorita", tilt: "4deg", cls: "left-[30%] top-[34%] w-[40%] z-10", delay: "0.6s" },
  { key: "azulejo", tilt: "-4deg", cls: "left-0 bottom-[2%] w-[32%]", delay: "1.8s" },
  { key: "squeeze", tilt: "7deg", cls: "right-[2%] bottom-[8%] w-[32%]", delay: "0.9s" },
];

const STEPS = [
  { icon: Sparkles, title: "Escolha o produto", body: "Canecas, camisetas, azulejos, brindes e muito mais." },
  { icon: Palette, title: "Personalize", body: "Escolha o modelo, escreva o texto e veja a prévia na hora." },
  { icon: MessageCircle, title: "Envie pelo WhatsApp", body: "Confirmamos valores, prazo e a arte antes de produzir." },
];

const PERKS = [
  { icon: Heart, title: "Atendimento atencioso", body: "A gente ajuda você a escolher o presente ideal." },
  { icon: Star, title: "Qualidade", body: "Impressão caprichada e materiais que duram." },
  { icon: Palette, title: "Criação de artes", body: "Não tem a arte? Nós criamos com você." },
  { icon: Zap, title: "Agilidade", body: "Pedidos rápidos em muitos produtos — consulte." },
];

function Home() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const mug = getProduct("caneca-personalizada");

  return (
    <>
      {/* Hero */}
      <section className="bg-warm relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pb-24 md:pt-16">
          <div className="animate-rise space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-whatsapp" /> Loja em Santa Maria – RS
            </span>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl">
              Presentes com a <span className="text-gradient-brand">sua cara.</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Canecas, camisetas, azulejos e lembranças personalizadas para aniversários, casamentos, formaturas e
              qualquer data especial.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/produtos">
                  Ver produtos <ArrowRight />
                </Link>
              </Button>
              {mug && (
                <Button asChild variant="soft" size="xl">
                  <Link to="/produto/$slug" params={{ slug: mug.slug }}>
                    Personalizar uma caneca
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
            <div className="bg-gradient-brand absolute inset-[14%] rounded-full opacity-25 blur-3xl" />
            {HERO_TILES.map((t) => {
              const src = productImage(t.key);
              return (
                src && (
                  <div
                    key={t.key}
                    className={`animate-float tile absolute aspect-square shadow-lift ${t.cls}`}
                    style={{ ["--tilt" as string]: t.tilt, animationDelay: t.delay }}
                  >
                    <img src={src} alt="" className="h-full w-full scale-[1.04] object-cover" />
                  </div>
                )
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold">Categorias</h2>
          <Link to="/produtos" className="text-sm font-semibold text-primary">Ver tudo →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.id }}
              className="group flex items-center gap-3 rounded-3xl bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="tile w-14 shrink-0 sm:w-16">
                <img src={productImage(c.cover)} alt="" className="aspect-square h-full w-full scale-[1.04] object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{c.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.blurb}</p>
              </div>
            </Link>
          ))}
          <a
            href={whatsappLink("Olá, DJP! Tenho uma ideia de presente personalizado e queria um orçamento.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-3xl bg-ink p-3 text-ink-foreground shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <div className="tile flex aspect-square w-14 shrink-0 items-center justify-center bg-whatsapp sm:w-16">
              <WhatsAppIcon className="h-7 w-7 text-whatsapp-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Tem outra ideia?</p>
              <p className="mt-0.5 text-xs text-ink-foreground/70">Peça um orçamento</p>
            </div>
          </a>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <p className="eyebrow text-accent">Mais pedidos</p>
        <h2 className="mt-1 text-3xl font-extrabold">Queridinhos da DJP</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="rounded-[2rem] bg-ink p-7 text-ink-foreground sm:p-12">
          <p className="eyebrow text-sun">Como funciona</p>
          <h2 className="mt-2 max-w-lg text-3xl font-extrabold sm:text-4xl">Do jeitinho que você imaginou, em 3 passos.</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-3xl bg-ink-foreground/5 p-5 ring-1 ring-ink-foreground/10">
                <div className="flex items-center gap-3">
                  <span className="font-display text-4xl font-extrabold text-accent">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-sun" />
                </div>
                <p className="mt-3 font-display text-lg font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-ink-foreground/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Occasions + perks */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-3xl font-extrabold">Para toda ocasião</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <span key={o} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
              {o}
            </span>
          ))}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-3xl bg-secondary p-5">
              <p.icon className="h-6 w-6 text-primary" />
              <p className="mt-3 font-display text-lg font-bold">{p.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">O que nossos clientes mais elogiam.</p>
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="bg-gradient-brand relative overflow-hidden rounded-[2rem] p-7 text-primary-foreground sm:p-12">
          <h2 className="max-w-xl text-3xl font-extrabold sm:text-4xl">Visite a loja no Calçadão ou peça pelo WhatsApp.</h2>
          <p className="mt-3 max-w-lg text-primary-foreground/85">
            {STORE.address}, {STORE.city}. {STORE.hours}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappLink("Olá, DJP! Vim pelo site e gostaria de um orçamento.")} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="h-5 w-5" /> Chamar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="hero" size="xl">
              <Link to="/contato">Como chegar</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
