import Link from "next/link";
import { Bell, ChartNoAxesColumnIncreasing } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#0c0b09] text-amber-50">
      <header className="flex h-[76px] items-center justify-between border-b border-white/10 bg-[#11100d] px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-extrabold text-amber-50 lg:hidden">
          <ChartNoAxesColumnIncreasing size={19} className="text-[#d6b66c]" /> پنل جام جم
        </Link>
        <p className="hidden text-sm text-stone-400 lg:block">سامانه مدیریت شرکت آسانسور جام جم</p>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="اعلان‌ها" className="relative grid h-10 w-10 place-items-center rounded-xl text-stone-400 hover:bg-white/5">
            <Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d6b66c]" />
          </button>
          <div className="flex items-center gap-2 border-r border-white/10 pr-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#c3a258]/15 text-xs font-black text-[#d6b66c]">خ</span>
            <div className="hidden sm:block"><p className="text-xs font-bold text-amber-50">مدیریت جام جم</p><p className="mt-1 text-[10px] text-stone-500">مدیر سامانه</p></div>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <AdminSidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
