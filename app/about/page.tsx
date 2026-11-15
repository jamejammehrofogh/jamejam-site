import type { Metadata } from "next";
import { ArrowLeft, Building2, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "درباره شرکت آسانسور جام جم، تجربه اجرا، راهکارهای ایمنی و تیم متخصص ما.",
};

const values = [
  {
    title: "ایمنی در اولویت",
    description: "طراحی و اجرای آسانسور با استانداردهای فنی و کنترل کیفی دقیق برای عملکرد مطمئن در طول زمان.",
    icon: ShieldCheck,
  },
  {
    title: "تجربه اجرایی",
    description: "همکاری با تیم فنی و مهندسی برای اجرای پروژه‌های مسکونی، تجاری و صنعتی با رضایت مشتری.",
    icon: Building2,
  },
  {
    title: "پشتیبانی مداوم",
    description: "از مشاوره اولیه تا نگهداری و تعمیرات، همراهی مستمر ما در تمام مراحل برای آرامش شماست.",
    icon: Wrench,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <section className="bg-dark-bg px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold text-gold-primary">درباره شرکت</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">آسانسور جام جم؛ همیار مطمئن در مسیر بالا رفتن</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
            شرکت آسانسور جام جم با تمرکز بر ایمنی، کیفیت اجرا و رضایت مشتری، خدمات طراحی، نصب، تعمیر و نگهداری آسانسور را با رویکردی حرفه‌ای ارائه می‌دهد.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {values.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-primary/20 bg-gold-primary/10 text-gold-primary">
                <Icon size={23} />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <span className="text-sm font-bold text-brand">نگاه ما</span>
            <h2 className="mt-3 text-3xl font-black text-ink">حرفه‌ای، شفاف و همواره در خدمت شما</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              با مدیریت آقای خوزان، تیم ما تلاش می‌کند تا پروژه‌های آسانسوری را با دقت بالا، هماهنگی کامل و پاسخ‌گویی سریع پیش ببرد. از بررسی نیاز ساختمان تا انتخاب تجهیزات مناسب، ما همراه شما هستیم.
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              در هر مرحله، اولویت ما ایمنی کاربران، طول عمر تجهیز و تجربه‌ای مطمئن برای ساکنان و مدیران ساختمان است.
            </p>
          </div>
          <div className="rounded-3xl bg-mist p-6 shadow-sm">
            <h3 className="text-xl font-black text-ink">چرا با ما همکاری کنیم؟</h3>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <li>• بررسی دقیق نیاز پروژه و پیشنهاد راهکار مناسب</li>
              <li>• اجرای استاندارد با تجهیزات قابل‌اعتماد</li>
              <li>• پشتیبانی و خدمات پس از فروش</li>
              <li>• هماهنگی شفاف و پاسخ‌گویی در کوتاه‌ترین زمان</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <Link href="/quote" className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
          درخواست مشاوره رایگان
          <ArrowLeft size={16} />
        </Link>
      </section>
    </div>
  );
}
