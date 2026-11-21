import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { ProductThumb } from "./ProductThumb";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.oldPrice !== undefined && product.price !== undefined && product.oldPrice > product.price;
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col gap-3 rounded-3xl bg-card p-3 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <ProductThumb product={product} className="transition-transform duration-500 group-hover:scale-[1.02]" />
        {onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-bold text-accent-foreground shadow-soft">
            Oferta
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-1 pb-1">
        <h3 className="line-clamp-2 text-[0.95rem] font-semibold leading-snug">{product.name}</h3>
        <Price product={product} className="mt-auto" />
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden /> Personalizar
        </span>
      </div>
    </Link>
  );
}
