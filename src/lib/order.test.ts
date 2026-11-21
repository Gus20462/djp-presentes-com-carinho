import { describe, expect, it } from "vitest";
import { buildOrderMessage, cartTotal, whatsappLink, type CartItem } from "./order";

const mug: CartItem = {
  id: "1",
  slug: "caneca-personalizada",
  name: "Caneca Personalizada",
  unitPrice: 35,
  quantity: 2,
  options: [{ label: "Modelo", value: "Tarja preta" }],
  text: "Feliz aniversário, Ana",
  font: "Manuscrita",
  hasImage: true,
  notes: "",
};
const invite: CartItem = { ...mug, id: "2", name: "Convites e Impressos", unitPrice: undefined, quantity: 50 };

describe("pedido pelo WhatsApp", () => {
  it("envia para o WhatsApp da DJP (55) 99949-8162", () => {
    expect(whatsappLink("oi")).toBe("https://wa.me/5555999498162?text=oi");
  });

  it("soma o total de referência e marca itens sob consulta", () => {
    expect(cartTotal([mug, invite])).toEqual({ total: 70, hasUnpriced: true });
  });

  it("inclui modelo, texto e aviso de foto na mensagem", () => {
    const msg = buildOrderMessage([mug], { name: "Ana", delivery: "retirar", neededBy: "2026-12-05", notes: "" });
    expect(msg).toContain("Modelo: Tarja preta");
    expect(msg).toContain('Texto: "Feliz aniversário, Ana"');
    expect(msg).toContain("Vou enviar a foto/arte");
    expect(msg).toContain("R$ 70,00");
    expect(msg).toContain("Preciso para: 05/12/2026");
  });
});
