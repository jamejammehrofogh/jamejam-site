import Link from "next/link";
import { GraduationCap, ShoppingCart, Sparkles, Wrench } from "lucide-react";

const HERO_IMAGE = "/images/hero-bg.jpg";

const CARDS = [
  {
    href: "/store",
    icon: ShoppingCart,
    title: "فروشگاه آسانسور و قطعات",
  },
  {
    href: "/training",
    icon: GraduationCap,
    title: "بخش آموزش کارآموزان",
  },
  {
    href: "/services",
    icon: Wrench,
    title: "خدمات تخصصی",
  },
];

export default function HeroSection() {
  return (
    <section dir="rtl" className="relative w-full overflow-hidden">
      {/* Hero background — full-bleed image, never pushes or overlaps content */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero content */}
      <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center pt-24 pb-28 text-center">
          {/* Green badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 border border-emerald-500/50 text-emerald-100 px-6 py-2 text-sm">
            <Sparkles size={16} />
            شرکت آسانسور و پله برقی جام جم – مدیریت آقای خوزان
          </span>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mt-6">
            تجربه حرکت در اوج زیبایی
          </h1>

          {/* Sub-headline */}
          <p className="text-lg md:text-2xl text-gray-200 mt-4 max-w-2xl mx-auto leading-9">
            نصب، تعمیرات و سرویس تخصصی آسانسور و پله برقی باکیفیت‌ترین قطعات و
            استانداردهای روز، برای ساختمان‌های لوکس شما.
          </p>
      </div>

      {/* Glassmorphism overlapping cards */}
      <div className="relative z-10 mt-[-80px] max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition hover:bg-slate-900/60 hover:border-yellow-500/50 shadow-xl"
            >
              <span className="bg-yellow-500 text-black p-3 rounded-full mb-4">
                <card.icon size={26} />
              </span>
              <span className="text-lg font-bold text-white">{card.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
