"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import type { Product } from "@/lib/store-data";

export function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      type="button"
      onClick={() => add(product)}
      disabled={product.stock === 0}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gold-primary px-4 py-3 text-xs font-bold text-stone-950 shadow-md shadow-black/30 transition hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-lg hover:shadow-black/40 active:translate-y-0 disabled:cursor-not-allowed disabled:border disabled:border-white/10 disabled:bg-white/5 disabled:text-stone-500 disabled:shadow-none sm:text-sm"
    >
      <ShoppingCart size={17} />
      {product.stock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
    </button>
  );
}
