import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { productCategories, products, getProduct, toman } from "@/lib/store-data";
import { database } from "@/lib/mock-db";

// خروجی استاتیک: هر محصول در زمان build رندر می‌شود
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: encodeURIComponent(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = database.products.find((item) => item.id === id) ?? getProduct(id);
  return { title: product?.title ?? "محصول پیدا نشد" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = database.products.find((item) => item.id === id) ?? getProduct(id);
  if (!product) notFound();

  const category = productCategories.find((item) => item.id === product.category)?.label;
  const relatedProducts = database.products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand">
        <ArrowRight size={17} />
        بازگشت به فروشگاه
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div
          role="img"
          aria-label={`تصویر ${product.title}`}
          className={`relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${product.color} bg-cover bg-center`}
          style={{ backgroundImage: `linear-gradient(0deg,rgba(12,11,9,.4),transparent 60%),url("${product.image}")` }}
        >
          <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-[#17140f]/75 px-4 py-2 text-xs font-bold text-amber-50 backdrop-blur">{category}</span>
        </div>
        <div className="py-2">
          <p className="text-sm font-bold text-brand">{product.brand}</p>
          <h1 className="mt-3 text-3xl font-black leading-relaxed text-ink sm:text-4xl">{product.title}</h1>
          <p className="mt-2 text-sm text-slate-500">کد کالا: {product.sku}</p>
          <p className={`mt-5 flex items-center gap-2 text-sm font-bold ${product.stock > 0 ? "text-gold-secondary" : "text-slate-500"}`}>
            <CheckCircle2 size={17} />
            {product.stock > 0 ? `موجود در انبار (${new Intl.NumberFormat("fa-IR").format(product.stock)} عدد)` : "در حال حاضر ناموجود"}
          </p>
          <p className="mt-6 text-2xl font-black text-brand">{toman(product.price)}</p>
          <p className="mt-5 leading-8 text-slate-600">{product.description}</p>
          <div className="mt-5"><AddToCartButton product={product} /></div>
          <div className="mt-7 rounded-2xl bg-mist p-5">
            <h2 className="font-extrabold text-ink">مشخصات فنی</h2>
            <dl className="mt-3 divide-y divide-slate-200">
              {product.specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">{key}</dt>
                  <dd className="text-left font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">قیمت و موجودی ممکن است تغییر کند؛ برای ثبت نهایی سفارش با کارشناسان جام جم هماهنگ کنید.</p>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-slate-100 pt-10">
          <h2 className="text-2xl font-black text-ink">محصولات مرتبط</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
