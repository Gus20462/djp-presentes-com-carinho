import { Gift, Mail } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { productImage } from "@/lib/product-images";
import { cn } from "@/lib/utils";

export function ProductThumb({ product, className }: { product: Product; className?: string }) {
  const src = productImage(product.image);
  if (src) {
    return (
      <div className={cn("tile aspect-square bg-muted", className)}>
        <img src={src} alt={product.name} loading="lazy" className="h-full w-full scale-[1.04] object-cover" />
      </div>
    );
  }
  const Icon = product.slug.includes("convite") ? Mail : Gift;
  return (
    <div className={cn("tile bg-gradient-brand flex aspect-square items-center justify-center", className)}>
      <Icon className="h-1/3 w-1/3 text-primary-foreground" strokeWidth={1.5} aria-hidden />
    </div>
  );
}
