import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ImagePlus, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FONTS, Mockup, TEXT_COLORS, hasPhoto, isDark, printBackground, type MockupState } from "@/components/site/Mockup";
import { Price } from "@/components/site/Price";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductThumb } from "@/components/site/ProductThumb";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { cart } from "@/lib/cart";
import { getCategory, getProduct, PRODUCTS, visibleOptions, type Product } from "@/lib/catalog";
import { buildOrderMessage, whatsappLink, type CartItem } from "@/lib/order";
import { PRICE_NOTICE } from "@/lib/store-info";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — DJP Presentes Personalizados` : "Produto — DJP Presentes Personalizados";
    const description = p?.description ?? "Produto personalizado da DJP Presentes Personalizados.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Produto não encontrado</h1>
      <p className="mt-2 text-muted-foreground">Ele pode ter saído do catálogo.</p>
      <Button asChild variant="hero" size="xl" className="mt-6">
        <Link to="/produtos">Ver todos os produtos</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function defaultSelections(product: Product): Record<string, string> {
  const out: Record<string, string> = {};
  for (const o of product.options ?? []) {
    const first = o.choices[0];
    if (first) out[o.id] = first.label;
  }
  return out;
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  return <Personalizer key={product.slug} product={product} />;
}

function Personalizer({ product }: { product: Product }) {
  const navigate = useNavigate();
  const category = getCategory(product.category);
  const [selections, setSelections] = useState(() => defaultSelections(product));
  const [text, setText] = useState("");
  const [font, setFont] = useState<string>(FONTS[0].id);
  const [pickedTextColor, setTextColor] = useState<string | undefined>(undefined);
  const autoTextColor = isDark(printBackground(product, selections)) ? TEXT_COLORS[1].color : TEXT_COLORS[0].color;
  const textColor = pickedTextColor ?? autoTextColor;
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState<"preview" | "photo">("preview");
  const [added, setAdded] = useState(false);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const state: MockupState = { selections, text, font, textColor, imageUrl };
  const showToggle = product.mockup !== "photo" && hasPhoto(product);
  const related = useMemo(
    () => PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4),
    [product],
  );

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Escolha um arquivo de imagem (JPG, PNG…).");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Imagem muito grande. Use uma de até 15 MB.");
      return;
    }
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setView("preview");
  }

  function toItem(): Omit<CartItem, "id"> {
    const fontLabel = FONTS.find((f) => f.id === font)?.id ?? "Moderna";
    const colorLabel = TEXT_COLORS.find((c) => c.color === textColor)?.label;
    const options = visibleOptions(product, selections).map((o) => ({ label: o.label, value: selections[o.id] ?? "" }));
    if (text.trim() && colorLabel) options.push({ label: "Cor do texto", value: colorLabel });
    return {
      slug: product.slug,
      name: product.name,
      unitPrice: product.price,
      quantity,
      options,
      text: text.trim().slice(0, 80),
      font: fontLabel,
      hasImage: Boolean(imageUrl),
      notes: notes.trim().slice(0, 500),
    };
  }

  function addToCart() {
    cart.add(toItem());
    setAdded(true);
    toast.success("Adicionado ao carrinho!", {
      description: product.name,
      action: { label: "Ver carrinho", onClick: () => navigate({ to: "/carrinho" }) },
    });
    setTimeout(() => setAdded(false), 2000);
  }

  const directMessage = buildOrderMessage([{ ...toItem(), id: "direct" }], {
    name: "",
    delivery: "retirar",
    neededBy: "",
    notes: "",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
      <Link
        to="/produtos"
        search={{ categoria: product.category }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {category?.name ?? "Produtos"}
      </Link>

      <div className="mt-4 flex flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Preview — stays visible on phones while the customer fills the form */}
        <div className="sticky top-16 z-20 -mx-4 bg-background/95 px-4 pb-3 pt-2 backdrop-blur lg:top-24 lg:mx-0 lg:self-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="bg-warm relative overflow-hidden rounded-[2rem] bg-secondary px-6 pb-9 pt-6 sm:px-10 lg:pb-12 lg:pt-12">
            {showToggle && (
              <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-full bg-card/90 p-1 shadow-soft">
                {(["preview", "photo"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      view === v ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v === "preview" ? "Prévia" : "Foto real"}
                  </button>
                ))}
              </div>
            )}
            <p className="eyebrow mb-4 hidden text-center text-muted-foreground lg:block">
              {view === "preview" ? "Prévia da sua personalização" : "Foto do produto"}
            </p>
            <div className="mx-auto max-w-[15rem] sm:max-w-xs lg:max-w-none">
              {view === "preview" ? <Mockup product={product} state={state} /> : <ProductThumb product={product} className="mx-auto max-w-sm shadow-lift" />}
            </div>
          </div>
          <p className="mt-3 hidden text-center text-xs text-muted-foreground lg:block">
            A prévia é ilustrativa. Nossa equipe ajusta a arte e envia para sua aprovação antes de produzir.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-7">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
            <Price product={product} size="lg" />
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {visibleOptions(product, selections).map((opt) => (
            <fieldset key={opt.id} className="space-y-2.5">
              <legend className="text-sm font-semibold">
                {opt.label}: <span className="font-normal text-muted-foreground">{selections[opt.id]}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {opt.choices.map((c) => {
                  const active = selections[opt.id] === c.label;
                  if (c.color) {
                    return (
                      <button
                        key={c.label}
                        type="button"
                        title={c.label}
                        aria-label={c.label}
                        aria-pressed={active}
                        onClick={() => setSelections((s) => ({ ...s, [opt.id]: c.label }))}
                        className={cn(
                          "h-9 w-9 rounded-full ring-1 ring-border transition-all",
                          active && "ring-[3px] ring-primary ring-offset-2 ring-offset-background",
                        )}
                        style={{ backgroundColor: c.color }}
                      />
                    );
                  }
                  return (
                    <button
                      key={c.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelections((s) => ({ ...s, [opt.id]: c.label }))}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card hover:border-foreground/40",
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="space-y-4 rounded-3xl border border-border bg-card p-5">
            <p className="font-display text-lg font-bold">Personalize</p>
            <div className="space-y-2">
              <Label htmlFor="texto">{product.textLabel ?? "Texto"}</Label>
              <Input
                id="texto"
                value={text}
                maxLength={80}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex.: Feliz aniversário, Ana!"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Estilo da letra</Label>
                <div className="flex flex-wrap gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFont(f.id)}
                      className={cn(
                        "rounded-xl border px-3 py-1.5 text-base transition-colors",
                        f.className,
                        font === f.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground/40",
                      )}
                    >
                      {f.id}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor do texto</Label>
                <div className="flex flex-wrap gap-2">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      title={c.label}
                      aria-label={c.label}
                      onClick={() => setTextColor(c.color)}
                      className={cn(
                        "h-8 w-8 rounded-full ring-1 ring-border",
                        textColor === c.color && "ring-[3px] ring-primary ring-offset-2 ring-offset-card",
                      )}
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto, logo ou arte</Label>
              {imageUrl ? (
                <div className="flex items-center gap-3 rounded-xl bg-secondary p-2.5">
                  <img src={imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{imageName}</p>
                    <p className="text-xs text-muted-foreground">Você envia o arquivo original no WhatsApp.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(undefined);
                      setImageName("");
                    }}
                    className="rounded-full p-2 hover:bg-background"
                    aria-label="Remover imagem"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 transition-colors hover:border-primary hover:bg-primary/5">
                  <ImagePlus className="h-6 w-6 text-primary" />
                  <span className="text-sm">
                    <span className="font-semibold">Adicionar imagem para a prévia</span>
                    <span className="block text-xs text-muted-foreground">O arquivo fica só no seu aparelho.</span>
                  </span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalhes">Descreva sua ideia</Label>
              <Textarea
                id="detalhes"
                value={notes}
                maxLength={500}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tema, cores, ocasião, nomes, se quer que a gente crie a arte…"
                className="min-h-24 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Quantidade</span>
              <div className="flex items-center rounded-full border border-border bg-card">
                <button type="button" className="p-3" aria-label="Diminuir" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  aria-label="Quantidade"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value.replace(/\D/g, ""), 10);
                    setQuantity(Number.isFinite(n) ? Math.max(1, Math.min(999, n)) : 1);
                  }}
                  className="w-12 bg-transparent text-center font-semibold outline-none"
                />
                <button type="button" className="p-3" aria-label="Aumentar" onClick={() => setQuantity((q) => Math.min(999, q + 1))}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="hero" size="xl" onClick={addToCart}>
                {added ? <Check /> : <ShoppingBag />} {added ? "Adicionado!" : "Adicionar ao carrinho"}
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink(directMessage)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="h-5 w-5" /> Pedir agora
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="lg:hidden">A prévia é ilustrativa — ajustamos a arte e enviamos para sua aprovação. </span>
              {PRICE_NOTICE}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold">Você também pode gostar</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
