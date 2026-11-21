import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductThumb } from "@/components/site/ProductThumb";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { cart, useCart } from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { buildOrderMessage, cartTotal, formatBRL, lineTotal, whatsappLink, type CustomerInfo } from "@/lib/order";
import { PRICE_NOTICE, STORE } from "@/lib/store-info";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu carrinho — DJP Presentes Personalizados" },
      { name: "description", content: "Revise seus produtos personalizados e envie o pedido para a DJP pelo WhatsApp." },
      { property: "og:title", content: "Seu carrinho — DJP Presentes Personalizados" },
      { property: "og:description", content: "Revise e envie seu pedido pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Carrinho,
});

const customerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80, "Nome muito longo"),
  delivery: z.enum(["retirar", "entrega"]),
  neededBy: z.string().max(10),
  notes: z.string().trim().max(500, "Máximo de 500 caracteres"),
});

function Carrinho() {
  const items = useCart();
  const { total, hasUnpriced } = cartTotal(items);
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", delivery: "retirar", neededBy: "", notes: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function send() {
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Confira os dados");
      return;
    }
    setError("");
    const url = whatsappLink(buildOrderMessage(items, parsed.data));
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    toast.success("Pedido aberto no WhatsApp!", { description: "É só tocar em enviar na conversa." });
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold">Seu carrinho está vazio</h1>
        <p className="mt-2 text-muted-foreground">Escolha um produto, personalize e ele aparece aqui.</p>
        <Button asChild variant="hero" size="xl" className="mt-6">
          <Link to="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-4xl font-extrabold">Seu pedido</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ul className="space-y-3">
          {items.map((item) => {
            const product = getProduct(item.slug);
            const t = lineTotal(item);
            return (
              <li key={item.id} className="flex gap-4 rounded-3xl bg-card p-3 shadow-soft">
                {product && <ProductThumb product={product} className="w-24 shrink-0 self-start sm:w-28" />}
                <div className="min-w-0 flex-1 space-y-1.5 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link to="/produto/$slug" params={{ slug: item.slug }} className="font-semibold leading-snug hover:underline">
                      {item.name}
                    </Link>
                    <button onClick={() => cart.remove(item.id)} className="-mr-1 -mt-1 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Remover item">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="space-y-0.5 text-xs text-muted-foreground">
                    {item.options.map((o) => (
                      <li key={o.label}>{o.label}: {o.value}</li>
                    ))}
                    {item.text && <li>Texto: “{item.text}” ({item.font})</li>}
                    {item.hasImage && <li>Foto/arte: enviar no WhatsApp</li>}
                    {item.notes && <li className="line-clamp-2">Ideia: {item.notes}</li>}
                  </ul>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center rounded-full border border-border">
                      <button className="p-2" aria-label="Diminuir" onClick={() => cart.setQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button className="p-2" aria-label="Aumentar" onClick={() => cart.setQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display font-bold">{t === undefined ? "Sob consulta" : formatBRL(t)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="space-y-5 rounded-3xl bg-secondary p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total de referência</span>
            <span className="font-display text-3xl font-extrabold">{formatBRL(total)}</span>
          </div>
          {hasUnpriced && <p className="text-xs text-muted-foreground">+ itens sob consulta</p>}

          <div className="space-y-2">
            <Label htmlFor="nome">Seu nome</Label>
            <Input id="nome" value={customer.name} maxLength={80} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} className="h-11 rounded-xl bg-card" />
          </div>
          <div className="space-y-2">
            <Label>Como prefere receber?</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["retirar", "entrega"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setCustomer({ ...customer, delivery: d })}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    customer.delivery === d ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card",
                  )}
                >
                  {d === "retirar" ? "Retirar na loja" : "Combinar entrega"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Para quando você precisa? (opcional)</Label>
            <Input id="data" type="date" value={customer.neededBy} onChange={(e) => setCustomer({ ...customer, neededBy: e.target.value })} className="h-11 rounded-xl bg-card" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observações (opcional)</Label>
            <Textarea id="obs" value={customer.notes} maxLength={500} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} className="rounded-xl bg-card" />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button variant="whatsapp" size="xl" className="w-full" onClick={send}>
            <WhatsAppIcon className="h-5 w-5" /> Enviar pedido pelo WhatsApp
          </Button>
          {sent && (
            <button onClick={() => cart.clear()} className="w-full text-center text-sm text-muted-foreground underline underline-offset-4">
              Já enviei — limpar carrinho
            </button>
          )}
          <p className="text-xs text-muted-foreground">
            {PRICE_NOTICE} Pedido enviado para {STORE.whatsappDisplay}.
          </p>
        </div>
      </div>
    </div>
  );
}
