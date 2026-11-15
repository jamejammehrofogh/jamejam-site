"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/store/product-card";
import { productCategories, products as initialProducts, type Product, type ProductCategory } from "@/lib/store-data";

export function StoreCatalog({ initialQuery = "" }: { initialQuery?: string }) {
  const [category, setCategory] = useState<ProductCategory>("all");
  const [query, setQuery] = useState(initialQuery);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    fetch("/api/products")
      .then(async (response) => {
        const result: { products?: Product[]; message?: string } = await response.json();
        if (!response.ok || !result.products) throw new Error(result.message ?? "دریافت فهرست محصولات انجام نشد.");
        setProducts(result.products);
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "دریافت فهرست محصولات انجام نشد.");
      });
  }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fa");
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const matchesQuery =
        !search ||
        `${product.title} ${product.sku} ${product.brand}`.toLocaleLowerCase("fa").includes(search);
      return matchesCategory && matchesQuery && (!availableOnly || product.stock > 0);
    });
  }, [category, query, availableOnly, products]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {productCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                category === item.id ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-brand/40 hover:text-brand"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <label className="relative block flex-1 lg:w-64">
            <span className="sr-only">جستجو در محصولات</span>
            <Search size={17} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جستجوی نام یا کد کالا" className="h-11 w-full rounded-xl border-slate-200 pr-10 text-sm focus:border-brand focus:ring-brand" />
          </label>
          <label className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-600">
            <SlidersHorizontal size={15} />
            <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="rounded border-slate-300 text-brand focus:ring-brand" />
            موجودها
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {new Intl.NumberFormat("fa-IR").format(filtered.length)} محصول
      </p>
      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-500">محصولی با این مشخصات پیدا نشد.</div>
      )}
    </div>
  );
}
