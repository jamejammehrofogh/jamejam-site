import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import HeroSection from "@/components/hero-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8 lg:py-20">
        <div>
          <span className="text-sm font-bold text-brand">درباره آسانسور جام جم</span>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-relaxed text-ink sm:text-4xl">
            کیفیتی که در هر طبقه همراه شماست
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-slate-600">
            شرکت آسانسور جام جم با مدیریت آقای خوزان، در کنار شماست تا تجربه‌ای ایمن و قابل‌اعتماد از جابه‌جایی در ساختمان داشته باشید؛ از انتخاب و اجرای آسانسور تا سرویس‌های دوره‌ای و تأمین قطعات.
          </p>
        </div>
        <Link href="/about" className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark">
          بیشتر درباره ما
          <ArrowUpLeft size={17} />
        </Link>
      </section>
    </>
  );
}
