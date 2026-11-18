"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { productCategories, toman, type Product } from "@/lib/store-data";

export function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.category)?.label;
  const outOfStock = product.stockStatus === "out_of_stock";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-card focus-within:ring-2 focus-within:ring-brand/40">
      <Link
        href={`/store/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
        aria-label={`مشاهده ${product.title}`}
      >
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        {category ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-[#17140f]/80 px-3 py-1 text-[11px] font-bold text-amber-50 backdrop-blur">
            {category}
          </span>
        ) : null}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow ${outOfStock
            ? "bg-stone-900/85 text-stone-300"
            : product.stockStatus === "low_stock"
              ? "bg-amber-300/95 text-stone-950"
              : "bg-emerald-500/95 text-white"
            }`}
        >
          {outOfStock ? "ناموجود" : product.stockStatus === "low_stock" ? "موجودی محدود" : "موجود"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-medium tracking-wide text-slate-400">کد کالا: {product.sku}</p>
        <Link
          href={`/store/${product.id}`}
          className="mt-2 block min-h-12 text-[15px] font-extrabold leading-6 text-ink transition hover:text-brand"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-xs text-slate-500">برند: {product.brand}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
            <div>
              <p className="text-[10px] font-medium text-slate-400">قیمت</p>
              <p className="text-sm font-black text-brand">{toman(product.price)}</p>
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
