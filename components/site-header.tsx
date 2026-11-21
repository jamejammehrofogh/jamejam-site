"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, UserRound, X } from "lucide-react";

const links = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/about", label: "درباره ما" },
  { href: "/services", label: "خدمات" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/store", label: "فروشگاه" },
  { href: "/courses", label: "دوره‌های آموزشی" },
  { href: "/contact", label: "تماس با ما" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Right side: logo + brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="صفحه اصلی آسانسور جام جم">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow-500 text-black">
              <span className="text-xl font-black">ج</span>
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold text-white">آسانسور جام جم</span>
              <span className="mt-1 block text-[11px] text-gray-300">ایمنی در حرکت، آرامش در زندگی</span>
            </span>
          </Link>

          <a
            href="tel:09126975580"
            className="hidden bg-yellow-500 text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 sm:flex"
          >
            <Phone size={16} />
            تماس ۰۹۱۲ ۶۹۷ ۵۵۸۰
          </a>

          <Link
            href="/account"
            className="hidden items-center gap-2 text-sm font-medium text-white/90 transition hover:text-yellow-400 lg:flex"
          >
            <UserRound size={18} />
            ورود / ثبت‌نام
          </Link>
        </div>

        {/* Left side: hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 text-white transition hover:bg-white/10"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav aria-label="ناوبری موبایل" className="border-t border-white/10 bg-black/70 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-yellow-400"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              <UserRound size={16} />
              ورود / ثبت‌نام
            </Link>
            <a
              href="tel:09126975580"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-yellow-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-400"
            >
              <Phone size={16} />
              تماس ۰۹۱۲ ۶۹۷ ۵۵۸۰
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
