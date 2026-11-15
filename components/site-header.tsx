"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Menu,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { CartButton } from "@/components/store/cart-button";

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
    <header className="sticky top-0 z-50 border-b border-dark-border bg-dark-bg/95 text-[#f5f5f7] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="صفحه اصلی آسانسور جام جم">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg">
            <span className="text-xl font-black">ج</span>
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold text-ink">آسانسور جام جم</span>
            <span className="mt-1 block text-[11px] text-slate-500">ایمنی در حرکت، آرامش در زندگی</span>
          </span>
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form action="/store" role="search" className="hidden xl:flex">
            <label htmlFor="site-search" className="sr-only">جستجو در فروشگاه</label>
            <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-brand">
              <Search size={17} className="shrink-0 text-slate-400" />
              <input
                id="site-search"
                name="q"
                type="search"
                placeholder="جستجوی قطعات..."
                className="h-9 w-36 border-0 bg-transparent text-xs placeholder:text-slate-400 focus:ring-0"
              />
            </div>
          </form>
          <CartButton />
          <Link
            href="/account"
            className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-mist hover:text-brand lg:flex"
          >
            <UserRound size={17} />
            ورود / ثبت‌نام
          </Link>
          <a
            href="tel:09126975580"
            className="hidden h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-4 text-sm font-bold text-dark-bg transition hover:brightness-110 lg:flex"
          >
            <Phone size={16} />
            ۰۹۱۲ ۶۹۷ ۵۵۸۰
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-ink xl:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav aria-label="ناوبری موبایل" className="border-t border-slate-100 bg-white px-4 py-4 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-mist"
              >
                {link.label}
                <ArrowLeft size={15} className="text-slate-400" />
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-mist"
            >
              ورود / ثبت‌نام
              <UserRound size={16} className="text-slate-400" />
            </Link>
            <a
              href="tel:09126975580"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-3 text-sm font-bold text-dark-bg"
            >
              <Phone size={16} />
              تماس با ۰۹۱۲ ۶۹۷ ۵۵۸۰
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
