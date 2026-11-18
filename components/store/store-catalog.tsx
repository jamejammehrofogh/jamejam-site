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
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {productCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition duration-200 ${category === item.id
                ? "bg-brand text-white shadow-md shadow-brand/25"
                : "border border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label className="relative block flex-1 lg:w-72">
            <span className="sr-only">جستجو در محصولات</span>
            <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی نام، کد کالا یا برند…"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
            />
          </label>
          <label className="flex h-11 shrink-0 cursor-pointer select-none items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-brand/40">
            <SlidersHorizontal size={15} />
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
              className="rounded border-slate-300 text-brand focus:ring-brand"
            />
            فقط موجودها
          </label>
        </div>
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">
          {new Intl.NumberFormat("fa-IR").format(filtered.length)} محصول
          {category !== "all" ? (
            <span className="text-slate-400">
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
            className="text-xs font-bold text-brand underline-offset-4 hover:underline"
          >
            حذف فیلترها
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <PackageSearch size={40} className="text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-600">محصولی با این مشخصات پیدا نشد.</p>
          <p className="mt-1 text-xs text-slate-400">عبارت دیگری را جستجو کنید یا فیلترها را تغییر دهید.</p>
        </div>
      )}

      {/* Quote / consult fallback */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-dark-bg px-6 py-7 text-white sm:flex-row sm:px-8">
        <div>
          <p className="text-base font-black">قطعه موردنظرتان را پیدا نکردید؟</p>
          <p className="mt-1 text-sm text-slate-300">کارشناسان ما آماده پاسخگویی و استعلام قیمت قطعات خاص هستند.</p>
        </div>
        <a
          href="tel:09126975580"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold-primary px-5 py-3 text-sm font-bold text-stone-950 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <Phone size={16} />
          درخواست استعلام قیمت
        </a>
      </div>
    </div>
  );
}
