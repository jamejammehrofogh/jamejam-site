"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, LayoutDashboard, LogOut, PackageCheck, Settings2 } from "lucide-react";

const items = [
  { href: "/admin", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/admin/leads", label: "درخواست‌ها و سرنخ‌ها", icon: ClipboardList },
  { href: "/admin/orders", label: "سفارش‌های فروشگاه", icon: PackageCheck },
  { href: "/admin/products", label: "محصولات فروشگاه", icon: Boxes },
  { href: "/admin/content", label: "محتوای سایت", icon: Settings2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-[#11100d] p-4 lg:min-h-[calc(100vh-76px)] lg:w-64 lg:border-b-0 lg:border-l lg:border-white/10 lg:p-5">
      <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3a258] text-lg font-black text-[#17130b]">ج</span>
        <span><span className="block text-sm font-extrabold text-amber-50">مدیریت جام جم</span><span className="mt-1 block text-[11px] text-stone-500">پنل مدیریت</span></span>
      </Link>
      <nav aria-label="ناوبری پنل مدیریت" className="mt-5 flex gap-2 overflow-x-auto lg:grid lg:gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-[#c3a258]/10 text-[#d6b66c]" : "text-stone-400 hover:bg-white/5 hover:text-amber-50"}`}>
              <Icon size={17} />{label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 hidden border-t border-white/10 pt-4 lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-stone-500 hover:bg-white/5">
          <LogOut size={17} /> بازگشت به سایت
        </Link>
      </div>
    </aside>
  );
}
