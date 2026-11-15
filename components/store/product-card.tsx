"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { productCategories, toman, type Product } from "@/lib/store-data";

export function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.category)?.label;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-card">
      <Link
        href={`/store/${product.id}`}
        className={`relative block aspect-[4/3] bg-gradient-to-br ${product.color} bg-cover bg-center`}
        style={{ backgroundImage: `linear-gradient(0deg,rgba(12,11,9,.58),transparent 72%),url("${product.image}")` }}
        aria-label={`مشاهده ${product.title}`}
      >
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-[#17140f]/75 px-3 py-1 text-[11px] font-bold text-amber-50 backdrop-blur">{category}</span>
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${
          product.stockStatus === "out_of_stock"
            ? "bg-stone-900/80 text-stone-300"
            : product.stockStatus === "low_stock"
              ? "bg-amber-300/90 text-stone-950"
              : "bg-gold-primary/15 text-gold-light"
        }`}>
          {product.stockStatus === "out_of_stock" ? "ناموجود" : product.stockStatus === "low_stock" ? "موجودی محدود" : "موجود"}
        </span>
      </Link>
      <div className="p-4">
        <p className="text-[11px] text-slate-500">کد کالا: {product.sku}</p>
        <Link href={`/store/${product.id}`} className="mt-2 block min-h-12 font-extrabold leading-6 text-ink hover:text-brand">{product.title}</Link>
        <p className="mt-1 text-xs text-slate-500">{product.brand}</p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-sm font-black text-brand">{toman(product.price)}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
