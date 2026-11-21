import type { Product } from "@/lib/catalog";
import { formatBRL } from "@/lib/order";
import { cn } from "@/lib/utils";

export function Price({ product, className, size = "md" }: { product: Product; className?: string; size?: "md" | "lg" }) {
  if (product.price === undefined) {
    return <span className={cn("font-semibold text-primary", className)}>Sob consulta</span>;
  }
  const showOld = product.oldPrice !== undefined && product.oldPrice > product.price;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      {product.fromPrice && <span className="text-xs text-muted-foreground">a partir de</span>}
      <span className={cn("font-display font-bold text-foreground", size === "lg" ? "text-3xl" : "text-lg")}>
        {formatBRL(product.price)}
      </span>
      {showOld && <span className="text-sm text-muted-foreground line-through">{formatBRL(product.oldPrice!)}</span>}
      {product.unitNote && <span className="text-xs text-muted-foreground">({product.unitNote})</span>}
    </span>
  );
}
