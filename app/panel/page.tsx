/**
 * داشبورد دانشجو — /panel
 * شامل: خوش‌آمد با نام دانشجو، دوره‌های در حال گذراندن (با نوار پیشرفت)،
 * دوره‌های تکمیل‌شده، خلاصه پروفایل، و دکمه خروج.
 * داده‌ها از جدول enrollments خوانده می‌شود.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Award, BookOpen, CheckCircle2, GraduationCap, LogOut } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { findUserById, seedSampleEnrollments, getEnrollmentsByStudent } from "@/lib/auth/db";
import { getSession } from "@/lib/auth/session";
import { normalizeDigits } from "@/lib/auth/validation";

export const metadata: Metadata = { title: "پنل دانشجو" };

/** نمایش تاریخ به شکل شمسی فارسی */
function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function PanelPage() {
  // ۱) نشست را بخوان (layout هم چک کرده، ولی برای گرفتن نام کاربر لازم است)
  const session = await getSession();
  if (!session) redirect("/login");

  // ۲) اطلاعات کامل کاربر را از «دیتابیس» بخوان
  const user = await findUserById(session.sub);
  if (!user) redirect("/login"); // حساب حذف شده ولی توکن مانده

  // ۳) اگر دانشجو هیچ ثبت‌نامی ندارد، دو ثبت‌نام نمونه بساز (فقط بار اول)
  await seedSampleEnrollments(user.id);

  // ۴) ثبت‌نام‌های او را بخوان
  const enrollments = await getEnrollmentsByStudent(user.id);

  const inProgress = enrollments.filter((row) => !row.completed);
  const completed = enrollments.filter((row) => row.completed);

  return (
    <div className="min-h-[80vh] bg-dark-bg text-ink">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* هدر داشبورد: خوش‌آمد + دکمه خروج */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg">
              <GraduationCap size={28} aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">
                سلام {user.fullName} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                به پنل دانشجوی واحد آموزش جام جم خوش آمدید.
              </p>
            </div>
          </div>
          <LogoutButton>
            <LogOut size={16} aria-hidden />
            خروج از حساب
          </LogoutButton>
        </header>

        {/* خلاصه پروفایل */}
        <section
          aria-labelledby="profile-title"
          className="mt-10 rounded-3xl border border-dark-border bg-dark-card p-6 shadow-card"
        >
          <h2 id="profile-title" className="text-lg font-black">
            خلاصه پروفایل
          </h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">نام و نام خانوادگی</dt>
              <dd className="mt-1 font-bold">{user.fullName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">شماره موبایل</dt>
              <dd className="mt-1 font-bold" dir="ltr">
                {normalizeDigits(user.phone)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">تاریخ عضویت</dt>
              <dd className="mt-1 font-bold">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </section>

        {/* دوره‌های در حال گذراندن */}
        <section aria-labelledby="progress-title" className="mt-8">
          <h2 id="progress-title" className="flex items-center gap-2 text-xl font-black sm:text-2xl">
            <BookOpen size={20} className="text-gold-primary" aria-hidden />
            دوره‌های در حال گذراندن
          </h2>
          {inProgress.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dark-border bg-dark-card p-6 text-sm text-slate-400">
              فعلاً دوره‌ای در حال گذراندن ندارید. از{" "}
              <a href="/courses" className="font-bold text-gold-primary hover:underline">
                فهرست دوره‌ها
              </a>{" "}
              ثبت‌نام کنید.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {inProgress.map((row) => (
                <li
                  key={row.id}
                  className="rounded-3xl border border-dark-border bg-dark-card p-6 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-extrabold">{row.courseTitle}</h3>
                    <span className="text-sm font-black text-gold-primary">
                      ٪{row.progressPercent.toLocaleString("fa-IR")} پیشرفت
                    </span>
                  </div>
                  {/* نوار پیشرفت */}
                  <div
                    className="mt-4 h-3 overflow-hidden rounded-full bg-[#0f1115]"
                    role="progressbar"
                    aria-valuenow={row.progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`پیشرفت دوره ${row.courseTitle}`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all"
                      style={{ width: `${row.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    ثبت‌نام: {formatDate(row.enrolledAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* دوره‌های تکمیل‌شده */}
        <section aria-labelledby="completed-title" className="mt-10">
          <h2
            id="completed-title"
            className="flex items-center gap-2 text-xl font-black sm:text-2xl"
          >
            <CheckCircle2 size={20} className="text-emerald-400" aria-hidden />
            دوره‌های تکمیل‌شده
          </h2>
          {completed.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dark-border bg-dark-card p-6 text-sm text-slate-400">
              هنوز دوره‌ای را تکمیل نکرده‌اید. موفق باشید! 🌱
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {completed.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-4 rounded-3xl border border-emerald-500/30 bg-dark-card p-5 shadow-card"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Award size={22} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-extrabold">{row.courseTitle}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      تکمیل‌شده — ثبت‌نام: {formatDate(row.enrolledAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
