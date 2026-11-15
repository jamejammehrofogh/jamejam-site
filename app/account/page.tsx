import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole, UserRound } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام",
  description: "ورود یا ثبت‌نام در سامانه مشتریان آسانسور جام جم.",
};

export default function AccountPage() {
  return (
    <div className="min-h-[70vh] bg-mist px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-dark-bg p-8 text-white shadow-card">
          <p className="text-sm font-bold text-gold-primary">حساب کاربری</p>
          <h1 className="mt-3 text-3xl font-black">ورود و ثبت‌نام</h1>
          <p className="mt-4 text-sm leading-8 text-slate-300">
            برای پیگیری سفارش، درخواست‌های خرید و مدیریت اطلاعات پروژه، می‌توانید وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
          </p>
          <div className="mt-8 space-y-4 text-sm text-slate-200">
            <div className="flex items-center gap-3"><UserRound size={18} className="text-gold-primary" /> مشاهده سفارش‌ها و محصولات</div>
            <div className="flex items-center gap-3"><LockKeyhole size={18} className="text-gold-primary" /> مدیریت اطلاعات و درخواست‌های مشاوره</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black text-ink">در حال آماده‌سازی</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            بخش حساب کاربری در حال تکمیل است و به‌زودی با امکان ثبت‌نام و ورود واقعی فعال می‌شود.
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              شماره همراه: ۰۹۱۲ ۶۹۷ ۵۵۸۰
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              برای ثبت‌نام سریع، با تیم ما تماس بگیرید.
            </div>
          </div>
          <Link href="/quote" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">
            درخواست مشاوره
            <ArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
