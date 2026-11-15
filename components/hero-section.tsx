/* eslint-disable @next/next/no-img-element */
import React from 'react';

const SHORTCUTS = [
  {
    href: '/store',
    icon: '🛒',
    title: 'فروشگاه آسانسور و قطعات',
    subtitle: 'Elevator & Parts Store',
  },
  {
    href: '/training',
    icon: '🎓',
    title: 'بخش آموزشی کارآموزان',
    subtitle: 'Elevator Apprentice Training',
  },
  {
    href: '/services',
    icon: '🛠️',
    title: 'خدمات تخصصی',
    subtitle: 'Specialized Services',
  },
  {
    href: '/quote',
    icon: '📋',
    title: 'استعلام قیمت و مشاوره',
    subtitle: 'Price Quote & Consultation',
  },
  {
    href: 'tel:09126975580',
    icon: '📞',
    title: 'تماس مستقیم با مدیریت',
    subtitle: '۰۹۱۲ ۶۹۷ ۵۵۸۰',
  },
];

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="relative isolate w-full overflow-hidden bg-neutral-950 text-white"
    >
      {/* Ultra-luxury modern villa architecture background */}
      <img
        src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />



      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
        {/* Badge — dark slate text on a light glass backdrop */}
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-400/80 bg-white/70 px-5 py-2 text-xs font-semibold tracking-wide text-gray-900 backdrop-blur-md sm:text-sm">
          <span>✦</span>
          شرکت آسانسور و پله برقی جام جم — مدیریت آقای خوزان
        </span>

        {/* Main heading */}
        <h1 className="mt-8 text-4xl font-black leading-[1.4] text-gray-950 sm:text-5xl lg:text-6xl">
          تجربه حرکت در{' '}
          <span className="text-gray-950">اوج زیبایی</span>
        </h1>

        {/* Tagline — placed directly below the heading for maximum contrast */}
        <p className="mt-5 max-w-xl text-sm font-semibold leading-8 text-gray-900 sm:text-base">
          نصب، تعمیرات و سرویس تخصصی آسانسور و پله برقی باکیفیت‌ترین قطعات و
          استانداردهای روز، برای ساختمان‌های لوکس شما.
        </p>

        {/* Neutral divider */}
        <span
          className="mt-6 h-px w-24 bg-gradient-to-l from-transparent via-gray-900/40 to-transparent sm:w-32"
          aria-hidden="true"
        />

        {/* Neon shortcut buttons grid — RTL, responsive */}
        <nav className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {SHORTCUTS.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              // On desktop, the last row (2 of 5 cards) sits centered in the middle column
              className={[
                'group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-5 text-right backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent sm:p-6',
                index === 4 ? 'lg:col-start-2' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-2xl transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/20"
                aria-hidden="true"
              >
                {item.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.6)] transition-colors duration-300 sm:text-lg">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-white/70 transition-colors duration-300 group-hover:text-white/90 sm:text-sm">
                  {item.subtitle}
                </span>
              </span>

              <span
                className="mr-auto shrink-0 text-white/50 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-white"
                aria-hidden="true"
              >
                ←
              </span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
