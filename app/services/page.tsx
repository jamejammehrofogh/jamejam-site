import type { Metadata } from "next";
import { ArrowLeft, Building2, Cog, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "خدمات آسانسور",
  description: "طراحی، نصب، تعمیر، نگهداری و تأمین قطعات آسانسور توسط شرکت جام جم.",
};

const services = [
  {
    title: "طراحی و مشاوره",
    description: "بررسی نیاز ساختمان، تحلیل فضا و انتخاب مناسب‌ترین راهکار برای نصب و عملکرد بهینه آسانسور.",
    icon: Building2,
  },
  {
    title: "نصب و راه‌اندازی",
    description: "اجرای دقیق و استاندارد با هماهنگی فنی و کنترل کیفیت برای ایمنی و دوام بالای سیستم.",
    icon: Cog,
  },
  {
    title: "تعمیرات تخصصی",
    description: "عیب‌یابی حرفه‌ای و رفع سریع مشکلات، با استفاده از تجهیزات مناسب و تیم فنی متخصص.",
    icon: Wrench,
  },
  {
    title: "نگهداری و سرویس",
    description: "بازدیدهای دوره‌ای، سرویس‌های پیشگیرانه و حفظ عملکرد مطمئن آسانسور در طول زمان.",
    icon: ShieldCheck,
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="bg-dark-bg px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold text-gold-primary">خدمات ما</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">راهکارهای کامل آسانسور، از صفر تا صد</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
            با تجربه و تخصص تیم جام جم، خدمات مربوط به آسانسور را با دقت، سرعت و رعایت استانداردهای ایمنی ارائه می‌کنیم.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-primary/20 bg-gold-primary/10 text-gold-primary">
                <Icon size={23} />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-2">
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-mist p-6 sm:p-8">
            <h2 className="text-2xl font-black text-ink">درخواست خدمات</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              اگر به مشاوره، نصب یا تعمیر آسانسور نیاز دارید، تیم جام جم در کنار شماست تا با بررسی دقیق نیاز، بهترین راه‌حل را ارائه کند.
            </p>
            <Link href="/quote" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
              ثبت درخواست مشاوره
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
