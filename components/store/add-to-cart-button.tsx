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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
    >
      <ShoppingCart size={17} />
      {product.stock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
    </button>
  );
}
