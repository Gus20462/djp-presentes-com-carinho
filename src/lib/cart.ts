import { useSyncExternalStore } from "react";
import type { CartItem } from "./order";

const KEY = "djp-carrinho-v1";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed as CartItem[];
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked — keep in memory */
  }
  listeners.forEach((l) => l());
}

export const cart = {
  add(item: Omit<CartItem, "id">) {
    load();
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    commit([...items, { ...item, id }]);
  },
  setQuantity(id: string, quantity: number) {
    load();
    commit(items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(999, quantity)) } : i)));
  },
  remove(id: string) {
    load();
    commit(items.filter((i) => i.id !== id));
  },
  clear() {
    load();
    commit([]);
  },
};

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return items;
    },
    () => EMPTY,
  );
}

export function useCartCount(): number {
  return useCart().reduce((n, i) => n + i.quantity, 0);
}
