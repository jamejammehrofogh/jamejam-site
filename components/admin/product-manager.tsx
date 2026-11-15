"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { productCategories, toman, type Product } from "@/lib/store-data";

type ProductInput = Pick<Product, "title" | "category" | "sku" | "brand" | "price" | "stock" | "description">;

const emptyProduct: ProductInput = {
  title: "",
  category: "motors",
  sku: "",
  brand: "",
  price: 0,
  stock: 0,
  description: "",
};

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      const response = await fetch("/api/products");
      const result: { products?: Product[]; message?: string } = await response.json();
      if (!response.ok || !result.products) throw new Error(result.message ?? "دریافت محصولات انجام نشد.");
      setProducts(result.products);
      setLoadError("");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "دریافت محصولات انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadProducts(); }, []);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const body: ProductInput = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? "motors") as ProductInput["category"],
      sku: String(formData.get("sku") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      description: String(formData.get("description") ?? ""),
    };
    try {
      const response = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result: { message?: string } = await response.json();
      if (!response.ok) throw new Error(result.message ?? "ذخیره محصول انجام نشد.");
      await loadProducts();
      setEditing(null);
      setIsCreating(false);
      toast.success(editing ? "محصول ویرایش شد." : "محصول جدید اضافه شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره محصول انجام نشد.");
    } finally {
      setSaving(false);
    }
  }

  const activeProduct = editing;

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#14120f]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5 sm:p-6">
          <div><h1 className="text-xl font-black text-amber-50">محصولات فروشگاه</h1><p className="mt-2 text-sm text-stone-400">افزودن و ویرایش موجودی قطعات آسانسور</p></div>
          <button type="button" onClick={() => { setEditing(null); setIsCreating(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#c3a258] px-4 py-2.5 text-xs font-black text-[#17130b] hover:bg-[#d8bc78]"><Plus size={15} /> افزودن محصول</button>
        </div>
        {loadError ? <p role="alert" className="p-6 text-sm text-red-300">{loadError}</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-right text-sm">
              <thead className="bg-white/[0.03] text-xs text-stone-400"><tr><th className="px-5 py-3 font-medium">نام کالا</th><th className="px-5 py-3 font-medium">کد کالا</th><th className="px-5 py-3 font-medium">قیمت (تومان)</th><th className="px-5 py-3 font-medium">موجودی</th><th className="px-5 py-3 font-medium">دسته</th><th className="px-5 py-3 font-medium">ویرایش</th></tr></thead>
              <tbody className="divide-y divide-white/10">
                {loading ? <tr><td colSpan={6} className="px-5 py-10 text-center text-stone-400">در حال دریافت محصولات...</td></tr> :
                  products.map((product) => <tr key={product.id}>
                    <td className="px-5 py-4 font-bold text-amber-50">{product.title}</td><td className="px-5 py-4 text-xs text-stone-500">{product.sku}</td><td className="px-5 py-4 text-stone-300">{toman(product.price)}</td><td className="px-5 py-4 text-stone-300">{new Intl.NumberFormat("fa-IR").format(product.stock)}</td><td className="px-5 py-4 text-stone-400">{productCategories.find((category) => category.id === product.category)?.label ?? product.category}</td><td className="px-5 py-4"><button type="button" onClick={() => { setIsCreating(false); setEditing(product); }} aria-label={`ویرایش ${product.title}`} className="rounded-lg p-2 text-[#d6b66c] hover:bg-white/5"><Pencil size={16} /></button></td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {(editing || isCreating) && (
        <div role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative my-auto w-full max-w-2xl rounded-3xl border border-[#d6b66c]/20 bg-[#17140f] p-5 shadow-2xl sm:p-7">
            <button type="button" onClick={() => { setEditing(null); setIsCreating(false); }} aria-label="بستن" className="absolute left-4 top-4 rounded-lg p-2 text-stone-400 hover:bg-white/5"><X size={18} /></button>
            <h2 id="product-modal-title" className="text-xl font-black">{editing ? "ویرایش محصول" : "افزودن محصول"}</h2>
            <form key={activeProduct?.id ?? "new-product"} onSubmit={saveProduct} className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-stone-300">نام کالا<input name="title" required minLength={2} maxLength={100} defaultValue={activeProduct?.title} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <label className="text-sm text-stone-300">دسته‌بندی<select name="category" defaultValue={activeProduct?.category ?? emptyProduct.category} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]">{productCategories.filter((category) => category.id !== "all").map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
              <label className="text-sm text-stone-300">کد کالا<input name="sku" required minLength={2} maxLength={40} defaultValue={activeProduct?.sku} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <label className="text-sm text-stone-300">برند<input name="brand" required minLength={2} maxLength={80} defaultValue={activeProduct?.brand} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <label className="text-sm text-stone-300">قیمت (تومان)<input name="price" type="number" required min={1} step={1} defaultValue={activeProduct?.price} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <label className="text-sm text-stone-300">موجودی<input name="stock" type="number" required min={0} step={1} defaultValue={activeProduct?.stock ?? 0} className="mt-2 h-11 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <label className="text-sm text-stone-300 sm:col-span-2">توضیحات<textarea name="description" required minLength={2} maxLength={1000} rows={3} defaultValue={activeProduct?.description} className="mt-2 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" /></label>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => { setEditing(null); setIsCreating(false); }} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-stone-300 hover:bg-white/5">انصراف</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#c3a258] px-5 py-2.5 text-sm font-black text-[#17130b] disabled:opacity-50">{saving ? "در حال ذخیره..." : "ذخیره محصول"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
