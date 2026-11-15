import Link from "next/link";
import { Clock3, Instagram, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "درباره شرکت" },
  { href: "/services", label: "خدمات آسانسور" },
  { href: "/projects", label: "نمونه پروژه‌ها" },
  { href: "/store", label: "فروشگاه قطعات" },
  { href: "/contact", label: "تماس با ما" },
];

export function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-bg text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-xl font-black text-dark-bg">ج</span>
            <span className="text-lg font-extrabold">شرکت آسانسور جام جم</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
            همراه مطمئن شما در طراحی، نصب و نگهداری آسانسور. مدیریت شرکت بر عهده آقای خوزان است و کیفیت و ایمنی، اولویت همیشگی ماست.
          </p>
          <a
            href="https://instagram.com/"
            aria-label="اینستاگرام"
            className="mt-5 inline-grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-slate-200 transition hover:bg-white/10"
          >
            <Instagram size={18} />
          </a>
        </div>

        <div>
          <h2 className="text-base font-bold">دسترسی سریع</h2>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-300 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold">ساعات پاسخ‌گویی</h2>
          <div className="mt-5 flex items-start gap-3 text-sm leading-7 text-slate-300">
            <Clock3 size={18} className="mt-1 shrink-0 text-gold-primary" />
            <p>شنبه تا پنجشنبه<br />از ساعت ۹ تا ۱۸</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-400">پشتیبانی درخواست‌های تعمیراتی در تمام روزهای هفته</p>
        </div>

        <div>
          <h2 className="text-base font-bold">ارتباط با ما</h2>
          <a href="tel:09126975580" className="mt-5 flex items-center gap-3 text-sm text-slate-300 transition hover:text-white">
            <Phone size={18} className="text-gold-primary" />
            ۰۹۱۲ ۶۹۷ ۵۵۸۰
          </a>
          <div className="mt-4 flex items-start gap-3 text-sm leading-7 text-slate-300">
            <MapPin size={18} className="mt-1 shrink-0 text-gold-primary" />
            <p>برای دریافت نشانی دفتر و هماهنگی بازدید، با ما تماس بگیرید.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} شرکت آسانسور جام جم. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
