import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const runtime = "edge";
import { BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { SESSION_COOKIE, resolveSession } from "@/lib/training/students";
import { StudentLoginForm } from "@/components/training/student-login-form";

export const metadata: Metadata = {
  title: "ورود دانشجویان — مرکز آموزش جام جم",
  description: "ورود دانشجویان و کارآموزان به داشبورد شخصی آموزش جام جم",
};

export const dynamic = "force-dynamic";

export default async function StudentLoginPage() {
  const cookieStore = await cookies();
  if (resolveSession(cookieStore.get(SESSION_COOKIE)?.value)) {
    redirect("/training/dashboard");
  }

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 text-neutral-100"
    >
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link
          href="/training"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-xl font-black text-neutral-950">
            ج
          </span>
          <span className="text-right">
            <span className="block text-sm font-extrabold text-white">
              شرکت آسانسور جام جم
            </span>
            <span className="mt-1 block text-[11px] text-neutral-400">
              مرکز آموزش و گواهینامه تخصصی
            </span>
          </span>
        </Link>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              <GraduationCap size={26} />
            </span>
            <h1 className="mt-5 text-xl font-black text-white sm:text-2xl">
              ورود به داشبورد دانشجو
            </h1>
            <p className="mt-3 text-xs leading-7 text-neutral-400 sm:text-sm">
              با شماره موبایل یا کد ملی ثبت‌شده در واحد آموزش وارد شوید تا
              دوره‌ها و گواهینامه‌های خود را ببینید.
            </p>
          </div>

          <StudentLoginForm />

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="flex items-center gap-2 text-[11px] font-bold text-neutral-300">
              <BookOpen size={14} className="text-emerald-400" />
              حساب آزمایشی برای نمایش:
            </p>
            <p dir="ltr" className="mt-2 text-right font-mono text-[11px] text-neutral-400">
              09126975580 — 0012345678
            </p>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-500">
            <ShieldCheck size={13} className="text-emerald-400" />
            اطلاعات شما فقط برای پیگیری دوره و گواهینامه استفاده می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
