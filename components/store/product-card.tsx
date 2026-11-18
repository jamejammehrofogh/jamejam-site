"use client";

import { useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { productCategories, toman, type Product } from "@/lib/store-data";

const FALLBACK_IMAGE = "/images/store/placeholder.svg";

export function ProductCard({ product }: { product: Product }) {
  const category = productCategories.find((item) => item.id === product.category)?.label;
  const outOfStock = product.stockStatus === "out_of_stock";
  const [imageSrc, setImageSrc] = useState(product.image || FALLBACK_IMAGE);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1d2025] shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-gold-primary/30 hover:shadow-xl hover:shadow-black/40 focus-within:ring-2 focus-within:ring-gold-primary/40">
      <Link
        href={`/store/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#171a1e]"
        aria-label={`مشاهده ${product.title}`}
      >
        <img
          src={imageSrc}
          alt={product.title}
          loading="lazy"
          width={800}
          height={600}
          onError={() => {
            if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-48 sm:h-56 object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171a1e] to-transparent"
          aria-hidden="true"
        />
        {category ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-bold text-[#e6c87a] backdrop-blur">
            {category}
          </span>
        ) : null}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold shadow backdrop-blur ${outOfStock
            ? "bg-black/70 text-stone-400"
            : product.stockStatus === "low_stock"
              ? "bg-amber-400/95 text-stone-950"
              : "bg-emerald-500/95 text-white"
            }`}
        >
          {outOfStock ? "ناموجود" : product.stockStatus === "low_stock" ? "موجودی محدود" : "موجود"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-medium tracking-wide text-stone-500">کد کالا: {product.sku}</p>
        <Link
          href={`/store/${product.id}`}
          className="mt-2 block min-h-12 text-[15px] font-extrabold leading-6 text-stone-50 transition hover:text-gold-primary"
        >
          {product.title}
        </Link>
        <p className="mt-1 text-xs text-stone-400">برند: {product.brand}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2 rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5">
            <div>
              <p className="text-[10px] font-medium text-stone-500">قیمت</p>
              <p className="text-sm font-black text-[#e6c87a]">{toman(product.price)}</p>
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
