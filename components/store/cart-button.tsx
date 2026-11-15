"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`سبد خرید، ${new Intl.NumberFormat("fa-IR").format(count)} کالا`}
      className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-mist hover:text-brand"
    >
      <ShoppingBag size={19} />
      <span className="absolute -left-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
        {new Intl.NumberFormat("fa-IR").format(count)}
      </span>
    </button>
  );
}
