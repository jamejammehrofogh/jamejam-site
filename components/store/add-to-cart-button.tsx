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
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-xs font-bold text-white shadow-md shadow-brand/25 transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none sm:text-sm"
    >
      <ShoppingCart size={17} />
      {product.stock > 0 ? "افزودن به سبد خرید" : "ناموجود"}
    </button>
  );
}
