import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/catalog";
import { PRICE_NOTICE } from "@/lib/store-info";
import { cn } from "@/lib/utils";

interface ProdutosSearch {
  categoria?: CategoryId;
  busca?: string;
}

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): ProdutosSearch => {
    const out: ProdutosSearch = {};
    const cat = search["categoria"];
    if (typeof cat === "string" && CATEGORIES.some((c) => c.id === cat)) out.categoria = cat as CategoryId;
    const q = search["busca"];
    if (typeof q === "string" && q.trim()) out.busca = q.slice(0, 60);
    return out;
  },
  head: () => ({
    meta: [
      { title: "Produtos personalizados — DJP Presentes" },
      {
        name: "description",
        content: "Canecas, camisetas, azulejos, brindes e lembranças personalizadas. Escolha o modelo, personalize e peça pelo WhatsApp.",
      },
      { property: "og:title", content: "Produtos personalizados — DJP Presentes" },
      { property: "og:description", content: "Escolha o modelo, personalize e peça pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Produtos,
});

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Produtos() {
  const { categoria, busca } = Route.useSearch();
  const navigate = Route.useNavigate();
  const list = useMemo(() => {
    const q = busca ? normalize(busca) : "";
    return PRODUCTS.filter(
      (p) => (!categoria || p.category === categoria) && (!q || normalize(`${p.name} ${p.description}`).includes(q)),
    );
  }, [categoria, busca]);
  const active = CATEGORIES.find((c) => c.id === categoria);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <p className="eyebrow text-primary">Catálogo</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{active?.name ?? "Todos os produtos"}</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">{active?.blurb ?? "Escolha um produto, personalize do seu jeito e envie o pedido pelo WhatsApp."}</p>

      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          defaultValue={busca ?? ""}
          placeholder="Buscar: caneca, camiseta, chaveiro…"
          onChange={(e) => {
            const v = e.target.value;
            navigate({ search: (s) => ({ ...(s.categoria ? { categoria: s.categoria } : {}), ...(v.trim() ? { busca: v } : {}) }), replace: true });
          }}
          className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-4 text-sm shadow-soft outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        <Link
          to="/produtos"
          search={busca ? { busca } : {}}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !categoria ? "bg-ink text-ink-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
          )}
        >
          Todos
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/produtos"
            search={{ categoria: c.id, ...(busca ? { busca } : {}) }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              categoria === c.id ? "bg-ink text-ink-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-secondary p-10 text-center">
          <p className="font-display text-xl font-bold">Nada encontrado por aqui</p>
          <p className="mt-1 text-sm text-muted-foreground">Fale com a gente no WhatsApp — fazemos muitos outros produtos.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
      <p className="mt-8 text-center text-xs text-muted-foreground">{PRICE_NOTICE}</p>
    </div>
  );
}
