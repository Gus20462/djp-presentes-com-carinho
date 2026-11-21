import { STORE } from "./store-info";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  /** Reference unit price; undefined when the product is "sob consulta". */
  unitPrice: number | undefined;
  quantity: number;
  options: { label: string; value: string }[];
  text: string;
  font: string;
  hasImage: boolean;
  notes: string;
}

export interface CustomerInfo {
  name: string;
  delivery: "retirar" | "entrega";
  neededBy: string;
  notes: string;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace(/\u00a0/g, " ");
}

export function lineTotal(item: CartItem): number | undefined {
  return item.unitPrice === undefined ? undefined : Math.round(item.unitPrice * item.quantity * 100) / 100;
}

/** Sum of priced items, and whether some items still need a quote. */
export function cartTotal(items: CartItem[]): { total: number; hasUnpriced: boolean } {
  let total = 0;
  let hasUnpriced = false;
  for (const item of items) {
    const t = lineTotal(item);
    if (t === undefined) hasUnpriced = true;
    else total += t;
  }
  return { total: Math.round(total * 100) / 100, hasUnpriced };
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function buildOrderMessage(items: CartItem[], customer: CustomerInfo): string {
  const lines: string[] = [];
  lines.push(`Olá, ${STORE.name}! Gostaria de fazer um pedido pelo site:`);
  lines.push("");
  items.forEach((item, i) => {
    lines.push(`*${i + 1}. ${item.name}* — ${item.quantity} un.`);
    for (const opt of item.options) lines.push(`• ${opt.label}: ${opt.value}`);
    if (item.text.trim()) lines.push(`• Texto: "${item.text.trim()}" (fonte ${item.font})`);
    if (item.hasImage) lines.push("• Vou enviar a foto/arte aqui no WhatsApp");
    if (item.notes.trim()) lines.push(`• Detalhes: ${item.notes.trim()}`);
    const t = lineTotal(item);
    lines.push(t === undefined ? "• Valor: sob consulta" : `• Valor de referência: ${formatBRL(t)}`);
    lines.push("");
  });
  const { total, hasUnpriced } = cartTotal(items);
  if (total > 0) {
    lines.push(`*Total de referência:* ${formatBRL(total)}${hasUnpriced ? " + itens sob consulta" : ""}`);
  }
  lines.push("");
  if (customer.name.trim()) lines.push(`Nome: ${customer.name.trim()}`);
  lines.push(`Entrega: ${customer.delivery === "retirar" ? "Retirar na loja" : "Combinar entrega"}`);
  if (customer.neededBy) lines.push(`Preciso para: ${formatDate(customer.neededBy)}`);
  if (customer.notes.trim()) lines.push(`Observações: ${customer.notes.trim()}`);
  lines.push("");
  lines.push("Aguardo a confirmação de valores, prazo e pagamento. Obrigado!");
  return lines.join("\n");
}

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${STORE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
