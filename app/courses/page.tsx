// صفحه عمومی دوره‌های آموزشی — دکمه ثبت‌نام: لاگین‌ها مستقیم ثبت‌نام می‌شوند، مهمان‌ها به /login می‌روند
import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Laptop,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { FaqSection } from "@/components/training/faq-section";

export const metadata: Metadata = {
  title: "دوره‌های آموزشی آسانسور",
  description:
    "دوره‌های تخصصی نصب، نگهداری، ایمنی و تعمیرات آسانسور با مدرک معتبر از شرکت آسانسور جام جم.",
};

// داده دوره‌ها — فعلاً ثابت؛ در گام‌های بعد از دیتابیس خوانده می‌شود
const courses = [
  {
    slug: "basics",
    title: "مبانی آسانسور",
    level: "مقدماتی",
    levelColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    durationHours: 40,
    format: "حضوری",
    formatIcon: MapPin,
    description:
      "آشنایی با انواع آسانسور، اجزای اصلی، اصطلاحات فنی و مبانی ایمنی برای ورود به بازار کار.",
    priceToman: 1200000,
  },
  {
    slug: "install",
    title: "نصب و راه‌اندازی",
    level: "متوسط",
    levelColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    durationHours: 90,
    format: "حضوری",
    formatIcon: MapPin,
    description:
      "نصب کامل آسانسورهای کششی و هیدرولیکی مطابق استاندارد ملی ایران، از ریلی تا راه‌اندازی نهایی.",
    priceToman: 3500000,
  },
  {
    slug: "maintenance",
    title: "سرویس و نگهداری دوره‌ای",
    level: "متوسط",
    levelColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    durationHours: 60,
    format: "آنلاین + حضوری",
    formatIcon: Laptop,
    description:
      "برنامه سرویس دوره‌ای، چک‌لیست بازدید ماهانه و ثبت گزارش نگهداری مطابق الزامات استاندارد.",
    priceToman: 2400000,
  },
  {
    slug: "safety",
    title: "ایمنی و بازرسی",
    level: "پیشرفته",
    levelColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    durationHours: 45,
    format: "حضوری",
    formatIcon: MapPin,
    description:
      "آیین‌نامه‌های ایمنی، بازرسی دوره‌ای تجهیزات و آمادگی برای آزمون بازرسان آسانسور.",
    priceToman: null,
  },
  {
    slug: "repair",
    title: "تعمیرات و عیب‌یابی",
    level: "پیشرفته",
    levelColor: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    durationHours: 80,
    format: "حضوری",
    formatIcon: MapPin,
    description:
      "عیب‌یابی برد فرمان، درب، ترمز و سیستم موتور؛ شبیه‌سازی خرابی‌های رایج و رفع آن‌ها روی تجهیزات واقعی.",
    priceToman: 3800000,
  },
];

const steps = [
  {
    icon: BookOpen,
    title: "انتخاب دوره",
    text: "از میان کارت‌های بالا دوره متناسب با سطح خود را انتخاب کنید و دکمه «ثبت‌نام» را بزنید.",
  },
  {
    icon: Users,
    title: "ساخت حساب",
    text: "با نام و شماره موبایل خود در سایت ثبت‌نام کنید (یا اگر قبلاً عضو هستید وارد شوید).",
  },
  {
    icon: ClipboardCheck,
    title: "تأیید و پرداخت",
    text: "کارشناس آموزش با شما تماس می‌گیرد؛ پس از تأیید ظرفیت، هزینه دوره را تسویه می‌کنید.",
  },
  {
    icon: GraduationCap,
    title: "دریافت مدرک",
    text: "پس از تکمیل دوره، گواهینامه با QR قابل استعلام به‌صورت رسمی برای شما صادر می‌شود.",
  },
];

const faqs = [
  {
    q: "پیش‌نیاز دوره‌های پیشرفته چیست؟",
    a: "برای دوره‌های پیشرفته (ایمنی و بازرسی، تعمیرات و عیب‌یابی) گذراندن دوره مبانی یا سابقه کار میدانی با آسانسور لازم است.",
  },
  {
    q: "پس از پایان دوره مدرک معتبر می‌گیرم؟",
    a: "بله؛ گواهینامه شرکت آسانسور جام جم با شناسه یکتا و QR کد صادر می‌شود که هر سازمانی می‌تواند اصالت آن را در همین سایت استعلام کند.",
  },
  {
    q: "کلاس‌ها حضوری است یا آنلاین؟",
    a: "بیشتر دوره‌ها حضوری در سالن آموزش شرکت برگزار می‌شوند؛ دوره نگهداری به‌صورت ترکیبی (آنلاین + حضوری) ارائه می‌شود.",
  },
  {
    q: "هزینه دوره چگونه پرداخت می‌شود؟",
    a: "پس از ثبت‌نام، کارشناس آموزش برای هماهنگی پرداخت (فروش اقساطی برای دوره‌های بلند نیز امکان‌پذیر است) با شما تماس می‌گیرد.",
  },
  {
    q: "اگر ظرفیت دوره پر شده باشد چه کنم؟",
    a: "شماره تماس خود را ثبت کنید تا در لیست انتظار قرار بگیرید؛ با افتتاح دوره بعدی نخستین اولویت اعلام با شماست.",
  },
];

const PHONE = "09126975580";
const WHATSAPP = "https://wa.me/989126975580";

// قالب‌بندی قیمت با ارقام فارسی
function priceLabel(value: number | null): string {
  if (value === null) return "رایگان";
  return `${value.toLocaleString("fa-IR")} تومان`;
}

/**
 * خروجی استاتیک: Server Action ها پشتیبانی نمی‌شوند؛
 * ثبت‌نام فعلاً به صفحه ورود/پنل هدایت می‌کند و بعداً از طریق API واقعی انجام می‌شود.
 */
function enrollTarget(courseId: string): string {
  return `/login?course=${encodeURIComponent(courseId)}`;
}

export default function CoursesPage() {
  return (
    <div className="min-h-[70vh] bg-dark-bg text-ink">
      {/* هیرو */}
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <div className="absolute -left-16 top-32 h-56 w-56 rounded-full bg-brand-dark/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold text-gold-primary">واحد آموزش جام جم</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-relaxed sm:text-5xl">
            آموزش تخصصی آسانسور
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
            از مبانی تا عیب‌یابی پیشرفته — زیر نظر تکنسین‌های باتجربه شرکت آسانسور جام
            جم، با تمرین روی تجهیزات واقعی و دریافت گواهینامه قابل استعلام.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-7 py-3.5 text-sm font-bold text-dark-bg shadow-card transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            ثبت‌نام در دوره
            <ArrowLeft size={17} aria-hidden />
          </Link>
        </div>
      </section>

      {/* چرا یادگیری کار آسانسور */}
      <section aria-labelledby="why-title" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="why-title" className="text-2xl font-black sm:text-3xl">
          چرا صنعت آسانسور؟
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
          آسانسورهای کشور به نیروی فنی ماهر و مجرب نیاز دائمی دارند؛ از نصب ساختمان‌های
          جدید تا سرویس دوره‌ای هزاران ساختمان موجود. یادگیری این حرفه یعنی شغلی پایدار،
          درآمد روزشمار یا حقوق ثابت، و امکان کار مستقل پس از کسب تجربه — با مدرکی که
          مهارت شما را به‌صورت قابل استعلام اثبات می‌کند.
        </p>
      </section>

      {/* کارت‌های دوره */}
      <section aria-labelledby="courses-title" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 id="courses-title" className="text-2xl font-black sm:text-3xl">
          دوره‌های فعال
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <li
              key={course.slug}
              className="flex flex-col rounded-3xl border border-dark-border bg-dark-card p-6 shadow-card transition hover:-translate-y-1 hover:border-brand/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${course.levelColor}`}>
                  سطح: {course.level}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <course.formatIcon size={14} aria-hidden />
                  {course.format}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold">{course.title}</h3>
              <p className="mt-3 grow text-sm leading-7 text-slate-400">
                {course.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                <Clock size={14} aria-hidden />
                <span>{course.durationHours.toLocaleString("fa-IR")} ساعت آموزش</span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-dark-border pt-5">
                <span
                  className={`text-sm font-black ${course.priceToman === null ? "text-emerald-400" : "text-gold-light"}`}
                >
                  {priceLabel(course.priceToman)}
                </span>
                <Link
                  href={enrollTarget(course.slug)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-dark-bg transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  aria-label={`ثبت‌نام در دوره ${course.title}`}
                >
                  ثبت‌نام
                  <ArrowLeft size={15} aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* چطور ثبت‌نام کنم؟ */}
      <section aria-labelledby="how-title" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 id="how-title" className="text-2xl font-black sm:text-3xl">
          چطور ثبت‌نام کنم؟
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-dark-border bg-dark-card p-6"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg"
                aria-hidden
              >
                <step.icon size={20} />
              </span>
              <span className="mt-4 block text-xs font-bold text-gold-primary">
                گام {(index + 1).toLocaleString("fa-IR")}
              </span>
              <h3 className="mt-1 text-lg font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* پرسش‌های متداول */}
      <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 pb-14 sm:px-6 lg:px-8">
        <h2 id="faq-title" className="text-2xl font-black sm:text-3xl">
          پرسش‌های متداول
        </h2>
        <FaqSection items={faqs} />
      </section>

      {/* CTA نهایی: تماس + واتساپ */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-brand/30 bg-gradient-to-l from-[#1c180d] to-dark-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-black sm:text-3xl">هنوز سؤالی دارید؟</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
            کارشناس آموزش جام جم آماده پاسخ‌گویی به پرسش‌های شما درباره ظرفیت، شهریه
            و شرایط دوره‌هاست.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3 text-sm font-bold text-dark-bg transition hover:brightness-110 sm:w-auto"
            >
              <Phone size={16} aria-hidden />
              تماس: <span dir="ltr">۰۹۱۲ ۶۹۷ ۵۵۸۰</span>
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20 sm:w-auto"
            >
              <MessageCircle size={16} aria-hidden />
              گفتگو در واتساپ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
