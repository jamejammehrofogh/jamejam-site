import type { Metadata } from "next";
import { Clock3, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های تماس با شرکت آسانسور جام جم برای مشاوره، نصب، تعمیر و خدمات پس از فروش.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="bg-dark-bg px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold text-gold-primary">تماس با ما</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">برای هماهنگی مشاوره و خدمات، با ما در ارتباط باشید</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Phone className="text-brand" size={22} />
          <h2 className="mt-4 text-xl font-black text-ink">تلفن</h2>
          <a href="tel:09126975580" className="mt-3 block text-sm text-slate-600 hover:text-brand">۰۹۱۲ ۶۹۷ ۵۵۸۰</a>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <MessageCircle className="text-brand" size={22} />
          <h2 className="mt-4 text-xl font-black text-ink">واتساپ</h2>
          <a href="https://wa.me/989126975580" target="_blank" rel="noreferrer" className="mt-3 block text-sm text-slate-600 hover:text-brand">
            درخواست در واتساپ
          </a>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Clock3 className="text-brand" size={22} />
          <h2 className="mt-4 text-xl font-black text-ink">ساعات پاسخ‌گویی</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">شنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 text-brand" size={20} />
            <div>
              <h2 className="text-xl font-black text-ink">نشانی</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                جهت دریافت نشانی دقیق دفتر و هماهنگی بازدید، با ما تماس بگیرید تا همکاران ما زمان مناسب را با شما هماهنگ کنند.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className="rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
              درخواست مشاوره
            </Link>
            <a href="tel:09126975580" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-brand hover:text-brand">
              تماس مستقیم
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
