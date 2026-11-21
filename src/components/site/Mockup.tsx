import type { Product } from "@/lib/catalog";
import { productImage } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import { ProductThumb } from "./ProductThumb";

export const FONTS = [
  { id: "Moderna", className: "font-display font-extrabold" },
  { id: "Manuscrita", className: "font-script font-bold" },
  { id: "Clássica", className: "font-serif italic" },
] as const;

export const TEXT_COLORS = [
  { label: "Preto", color: "oklch(0.2 0.02 255)" },
  { label: "Branco", color: "oklch(0.99 0 0)" },
  { label: "Azul", color: "oklch(0.5 0.15 245)" },
  { label: "Vermelho", color: "oklch(0.57 0.21 27)" },
  { label: "Rosa", color: "oklch(0.68 0.19 355)" },
  { label: "Dourado", color: "oklch(0.72 0.12 80)" },
] as const;

const WHITE = "oklch(0.995 0 0)";
const BLACK = "oklch(0.2 0.01 255)";

/** Rough oklch lightness check so default text stays readable on dark products. */
export function isDark(color: string | undefined): boolean {
  const m = color?.match(/oklch\(\s*([\d.]+)/);
  return m ? Number(m[1]) < 0.5 : false;
}

/** The color the print sits on, used to pick a readable default text color. */
export function printBackground(product: Product, selections: Record<string, string>): string | undefined {
  if (product.slug === "caneca-magica") return BLACK;
  const cor = colorFor(product, "cor", selections);
  if (product.mockup === "shirt") return cor ?? WHITE;
  if (product.mockup === "mug" && selections["modelo"] === "Colorida") return cor;
  return WHITE;
}

export interface MockupState {
  selections: Record<string, string>;
  text: string;
  font: string;
  textColor: string;
  imageUrl: string | undefined;
}

function colorFor(product: Product, optionId: string, selections: Record<string, string>): string | undefined {
  const opt = product.options?.find((o) => o.id === optionId);
  const value = selections[optionId];
  return opt?.choices.find((c) => c.label === value)?.color;
}

function PrintArea({ state, className }: { state: MockupState; className: string }) {
  const font = FONTS.find((f) => f.id === state.font) ?? FONTS[0];
  const len = state.text.length;
  const size = len === 0 ? "" : len < 10 ? "text-[20cqw]" : len < 22 ? "text-[15cqw]" : len < 40 ? "text-[12cqw]" : "text-[9cqw]";
  return (
    <div className={cn("@container absolute flex flex-col items-center justify-center gap-1 overflow-hidden text-center", className)}>
      {state.imageUrl && (
        <img src={state.imageUrl} alt="Sua imagem" className={cn("w-full rounded-md object-cover", state.text ? "h-[62%]" : "h-full")} />
      )}
      {state.text && (
        <p className={cn("w-full break-words leading-tight", font.className, size)} style={{ color: state.textColor }}>
          {state.text}
        </p>
      )}
      {!state.text && !state.imageUrl && (
        <p className="eyebrow text-[0.6rem] opacity-40">Sua arte aqui</p>
      )}
    </div>
  );
}

function MugMockup({ product, state }: { product: Product; state: MockupState }) {
  const model = state.selections["modelo"] ?? "";
  const picked = colorFor(product, "cor", state.selections);
  const magic = product.slug === "caneca-magica";
  const heart = product.slug === "caneca-alca-coracao";
  const colored = model === "Colorida";
  const accentParts = model.startsWith("Alça") || heart;
  const body = magic ? BLACK : colored ? (picked ?? WHITE) : WHITE;
  const handle = accentParts || colored ? (picked ?? WHITE) : magic ? BLACK : WHITE;
  const inner = accentParts || colored ? (picked ?? WHITE) : magic ? BLACK : "oklch(0.93 0.005 80)";
  const small = model.startsWith("Pequena");
  const spoon = model === "Com colher";
  const band = model === "Tarja preta";

  return (
    <div className={cn("group relative mx-auto aspect-[5/4] w-full max-w-md transition-transform", small && "scale-[0.8]")}>
      <svg viewBox="0 0 300 240" className="absolute inset-0 h-full w-full drop-shadow-xl">
        <ellipse cx="125" cy="222" rx="95" ry="10" fill="oklch(0.2 0.02 255 / 0.12)" />
        {heart ? (
          <path d="M208 78 C 238 52, 282 74, 262 120 C 250 146, 222 160, 208 170" fill="none" stroke={handle} strokeWidth="20" strokeLinecap="round" />
        ) : (
          <path d="M208 72 C 268 66, 278 168, 208 168" fill="none" stroke={handle} strokeWidth="22" strokeLinecap="round" />
        )}
        <path d="M208 72 C 268 66, 278 168, 208 168" fill="none" stroke="oklch(0 0 0 / 0.06)" strokeWidth="22" strokeLinecap="round" opacity={heart ? 0 : 1} />
        <rect x="40" y="30" width="170" height="185" rx="16" fill={body} stroke="oklch(0.2 0.02 255 / 0.12)" />
        {band && (
          <>
            <rect x="40" y="30" width="170" height="26" rx="10" fill={BLACK} />
            <rect x="40" y="189" width="170" height="26" rx="10" fill={BLACK} />
          </>
        )}
        <ellipse cx="125" cy="31" rx="85" ry="9" fill={inner} stroke="oklch(0.2 0.02 255 / 0.15)" />
        <rect x="52" y="44" width="14" height="150" rx="7" fill="oklch(1 0 0 / 0.35)" />
        {spoon && (
          <g transform="rotate(14 190 20)">
            <rect x="186" y="-20" width="7" height="90" rx="3.5" fill="oklch(0.8 0.01 255)" />
            <ellipse cx="189.5" cy="-24" rx="11" ry="16" fill="oklch(0.84 0.01 255)" />
          </g>
        )}
      </svg>
      <PrintArea
        state={state}
        className={cn(
          "left-[18%] top-[27%] h-[48%] w-[47%] transition-opacity duration-700",
          magic && "opacity-15 group-hover:opacity-100",
        )}
      />
      {magic && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[0.7rem] text-ink-foreground">
          Passe o dedo/mouse para “esquentar”
        </span>
      )}
    </div>
  );
}

function ShirtMockup({ product, state }: { product: Product; state: MockupState }) {
  const color = colorFor(product, "cor", state.selections) ?? WHITE;
  const sleeve = colorFor(product, "manga", state.selections) ?? color;
  const side = state.selections["estampa"];
  const baby = product.slug.startsWith("body");
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full drop-shadow-xl">
        {baby ? (
          <path
            d="M105 40 L70 55 L40 95 L68 118 L88 100 L88 210 C 88 240, 110 262, 130 268 L135 285 L165 285 L170 268 C 190 262, 212 240, 212 210 L212 100 L232 118 L260 95 L230 55 L195 40 C 185 58, 168 66, 150 66 C 132 66, 115 58, 105 40 Z"
            fill={color}
            stroke="oklch(0.2 0.02 255 / 0.18)"
            strokeWidth="2"
          />
        ) : (
          <>
            <path
              d="M100 30 L60 46 L18 92 L52 124 L76 104 L76 272 L224 272 L224 104 L248 124 L282 92 L240 46 L200 30 C 190 52, 172 62, 150 62 C 128 62, 110 52, 100 30 Z"
              fill={color}
              stroke="oklch(0.2 0.02 255 / 0.18)"
              strokeWidth="2"
            />
            <path d="M100 30 L60 46 L18 92 L52 124 L76 104 Z" fill={sleeve} stroke="oklch(0.2 0.02 255 / 0.18)" strokeWidth="2" />
            <path d="M200 30 L240 46 L282 92 L248 124 L224 104 Z" fill={sleeve} stroke="oklch(0.2 0.02 255 / 0.18)" strokeWidth="2" />
          </>
        )}
        <path d="M100 30 C 110 52, 128 62, 150 62 C 172 62, 190 52, 200 30" fill="none" stroke="oklch(0.2 0.02 255 / 0.2)" strokeWidth="5" />
      </svg>
      <PrintArea state={state} className={cn(baby ? "left-[34%] top-[34%] h-[30%] w-[32%]" : "left-[34%] top-[28%] h-[36%] w-[32%]")} />
      {side && side !== "Frente" && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 text-[0.7rem] text-ink-foreground">
          Estampa: {side.toLowerCase()}
        </span>
      )}
    </div>
  );
}

function SquareMockup({ state }: { state: MockupState }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm rotate-[-3deg] rounded-[1.5rem] bg-paper shadow-lift ring-1 ring-border">
      <PrintArea state={state} className="inset-[9%]" />
    </div>
  );
}

function PhotoMockup({ product, state }: { product: Product; state: MockupState }) {
  const font = FONTS.find((f) => f.id === state.font) ?? FONTS[0];
  const hasCustom = state.text || state.imageUrl;
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <ProductThumb product={product} className="shadow-lift" />
      {hasCustom && (
        <div className="absolute -bottom-6 left-1/2 flex w-[88%] -translate-x-1/2 items-center gap-3 rounded-2xl bg-card p-3 shadow-lift">
          {state.imageUrl && <img src={state.imageUrl} alt="Sua imagem" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
          <div className="min-w-0">
            <p className="eyebrow text-[0.6rem] text-muted-foreground">Sua personalização</p>
            {state.text && (
              <p className={cn("truncate text-lg leading-tight", font.className)} style={{ color: state.textColor }}>
                {state.text}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Mockup({ product, state }: { product: Product; state: MockupState }) {
  switch (product.mockup) {
    case "mug":
      return <MugMockup product={product} state={state} />;
    case "shirt":
      return <ShirtMockup product={product} state={state} />;
    case "square":
      return <SquareMockup state={state} />;
    default:
      return <PhotoMockup product={product} state={state} />;
  }
}

export function hasPhoto(product: Product): boolean {
  return Boolean(productImage(product.image));
}
