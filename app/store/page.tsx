import type { Metadata } from "next";
import { StoreCatalog } from "@/components/store/store-catalog";

export const metadata: Metadata = {
  title: "فروشگاه قطعات آسانسور",
  description: "خرید و استعلام قطعات و تجهیزات آسانسور از فروشگاه جام جم.",
};

export default function StorePage() {
  const q = "";
  return (
    <div className="min-h-[65vh] bg-slate-50">
      <section className="bg-dark-bg px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold text-gold-primary">فروشگاه آسانسور جام جم</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">قطعات مطمئن برای حرکت ایمن</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">مشاهده مشخصات محصولات و درخواست استعلام موجودی و قیمت از کارشناسان ما.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <StoreCatalog initialQuery={q} />
      </section>
    </div>
  );
}
