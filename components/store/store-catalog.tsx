"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, PackageSearch, Phone } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { productCategories, products as initialProducts, type ProductCategory } from "@/lib/store-data";

export function StoreCatalog({ initialQuery = "" }: { initialQuery?: string }) {
  const [category, setCategory] = useState<ProductCategory>("all");
  const [query, setQuery] = useState(initialQuery);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fa");
    return initialProducts.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !search ||
        `${product.title} ${product.sku} ${product.brand} ${product.description}`
          .toLocaleLowerCase("fa")
          .includes(search);
      return matchesCategory && matchesQuery && (!availableOnly || product.stock > 0);
    });
  }, [category, query, availableOnly]);

  const hasFilters = category !== "all" || query.trim() !== "" || availableOnly;

  return (
    <div>
      {/* Toolbar: filters + search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-[#1d2025] p-4 shadow-lg shadow-black/30 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {productCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition duration-200 ${
                category === item.id
                  ? "bg-gold-primary text-stone-950 shadow-md shadow-black/40"
                  : "border border-white/10 bg-white/[0.03] text-stone-300 hover:border-gold-primary/40 hover:text-gold-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label className="relative block flex-1 lg:w-72">
            <span className="sr-only">جستجو در محصولات</span>
            <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی نام، کد کالا یا برند…"
              className="h-11 w-full rounded-xl border border-white/10 bg-black/30 pr-10 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-gold-primary/60 focus:bg-black/40 focus:ring-2 focus:ring-gold-primary/20"
            />
          </label>
          <label className="flex h-11 shrink-0 cursor-pointer select-none items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-stone-300 transition hover:border-gold-primary/40">
            <SlidersHorizontal size={15} />
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="rounded border-stone-600 bg-black/30 text-gold-primary focus:ring-gold-primary"
            />
            فقط موجودها
          </label>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-stone-400">
          {new Intl.NumberFormat("fa-IR").format(filtered.length)} محصول
          {category !== "all" ? (
            <span className="text-stone-500">
              {" "}در دسته «{productCategories.find((c) => c.id === category)?.label}»
            </span>
          ) : null}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
              setAvailableOnly(false);
            }}
            className="text-xs font-bold text-gold-primary underline-offset-4 hover:underline"
          >
            حذف فیلترها
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-[#1d2025]/60 py-16 text-center">
          <PackageSearch size={40} className="text-stone-600" />
          <p className="mt-3 text-sm font-bold text-stone-300">محصولی با این مشخصات پیدا نشد.</p>
          <p className="mt-1 text-xs text-stone-500">عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید.</p>
        </div>
      )}

      {/* Quote / consult fallback */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold-primary/15 bg-gradient-to-l from-[#23262b] to-[#171a1e] px-6 py-7 text-white sm:flex-row sm:px-8">
        <div>
          <p className="text-base font-black">قطعه موردنظرتان را پیدا نکردید؟</p>
          <p className="mt-1 text-sm text-stone-400">کارشناسان ما آماده پاسخگویی و استعلام قیمت قطعات خاص هستند.</p>
        </div>
        <a
          href="tel:09126975580"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold-primary px-5 py-3 text-sm font-bold text-stone-950 shadow-md shadow-black/40 transition hover:-translate-y-0.5 hover:bg-gold-light"
        >
          <Phone size={16} />
          درخواست استعلام قیمت
        </a>
      </div>
    </div>
  );
}
