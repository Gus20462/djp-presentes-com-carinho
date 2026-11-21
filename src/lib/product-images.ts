const modules = import.meta.glob<{ url: string }>("/src/assets/products/*.webp.asset.json", {
  eager: true,
  import: "default",
});

export function productImage(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return modules[`/src/assets/products/${key}.webp.asset.json`]?.url;
}
