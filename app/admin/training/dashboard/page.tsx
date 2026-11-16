/**
 * داشبورد آموزش ادمین — /admin/training/dashboard
 *
 * شامل:
 *  - فهرست دانشجوها، ثبت‌نام‌ها و گواهینامه‌ها همراه وضعیت
 *  - اکشن «تکمیل دوره» → صدور گواهینامه از طریق تابع گام ۴ (بدون تکرار)
 *  - اکشن «ابطال گواهینامه» → status='revoked'
 *  - لینک مشاهده گزارش اسکن هر گواهینامه (۲۰ اسکن آخر)
 *  - دکمه خروج ادمین
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Award, Ban, CheckCircle2, FileText, Users } from "lucide-react";

// خروجی استاتیک: Server Action ها موقتاً غیرفعال‌اند؛ اکشن‌ها بعداً از طریق API واقعی وصل می‌شوند.
// import {
//   adminLogoutAction,
//   completeEnrollmentAction,
//   revokeCertificateAction,
// } from "@/lib/admin/actions";
import { getAdminSession } from "@/lib/admin/session";
import { getEnrollments, getUsers } from "@/lib/auth/db";
import { getCertificates } from "@/lib/certificates/db";
import { formatJalaliDate } from "@/lib/certificates/jalali";

// خروجی استاتیک
export const metadata: Metadata = { title: "داشبورد آموزش", robots: { index: false } };

export default async function AdminTrainingDashboardPage() {
  // خروجی استاتیک: کوکی و داده‌های حافظه در زمان build در دسترس نیستند
  let session = null;
  try {
    session = await getAdminSession();
  } catch {
    session = null;
  }

  // خواندن داده‌ها (در build خالی است)
  const [users, enrollments, certificates] = await Promise.all([
    getUsers(),
    getEnrollments(),
    getCertificates(),
  ]);

  // وضعیت هر (studentId, courseId) — آیا گواهینامه دارد؟
  const certByKey = new Map(certificates.map((c) => [`${c.studentId}|${c.courseId}`, c]));

  return (
    <div className="min-h-[80vh] bg-dark-bg text-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* هدر */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">داشبورد آموزش</h1>
            <p className="mt-1 text-sm text-slate-400">
              خوش آمدید {session?.username} — مدیریت دانشجوها، ثبت‌نام‌ها و گواهینامه‌ها
            </p>
          </div>
          {/* خروج ادمین — بعد از اتصال API واقعی فعال می‌شود */}
          <a
            href="/admin/login"
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-sm font-bold text-rose-300"
          >
            خروج ادمین
          </a>
        </header>

        {/* ======== دانشجوها ======== */}
        <section aria-labelledby="students-title" className="mt-10">
          <h2 id="students-title" className="flex items-center gap-2 text-xl font-black">
            <Users size={20} className="text-gold-primary" aria-hidden />
            دانشجوها ({users.length.toLocaleString("fa-IR")})
          </h2>
          <div className="mt-4 overflow-x-auto rounded-3xl border border-dark-border bg-dark-card">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-dark-border text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">نام</th>
                  <th className="px-4 py-3 font-bold">موبایل</th>
                  <th className="px-4 py-3 font-bold">عضویت</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-dark-border/50 last:border-0">
                    <td className="px-4 py-3 font-bold">{user.fullName}</td>
                    <td className="px-4 py-3" dir="ltr">{user.phone}</td>
                    <td className="px-4 py-3 text-slate-400">{formatJalaliDate(user.createdAt)}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-500">هنوز دانشجویی ثبت‌نام نکرده است.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ======== ثبت‌نام‌ها ======== */}
        <section aria-labelledby="enrollments-title" className="mt-10">
          <h2 id="enrollments-title" className="text-xl font-black">
            ثبت‌نام‌ها ({enrollments.length.toLocaleString("fa-IR")})
          </h2>
          <ul className="mt-4 space-y-3">
            {enrollments.map((row) => {
              const cert = certByKey.get(`${row.studentId}|${row.courseId}`);
              return (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dark-border bg-dark-card p-4"
                >
                  <div>
                    <p className="font-bold">{row.courseTitle}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      دانشجو: {users.find((u) => u.id === row.studentId)?.fullName ?? row.studentId} —
                      پیشرفت: ٪{row.progressPercent.toLocaleString("fa-IR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {row.completed ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                        <CheckCircle2 size={14} aria-hidden />
                        تکمیل‌شده
                      </span>
                    ) : (
                      <span
                        className="rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-1.5 text-xs font-bold text-dark-bg opacity-50"
                        title="در نسخه استاتیک غیرفعال است"
                      >
                        تکمیل دوره و صدور مدرک
                      </span>
                    )}
                    {cert && (
                      <Link
                        href={`/admin/training/scans/${cert.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-primary hover:underline"
                      >
                        <FileText size={14} aria-hidden />
                        گزارش اسکن
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
            {enrollments.length === 0 && (
              <li className="rounded-2xl border border-dark-border bg-dark-card p-6 text-center text-sm text-slate-500">
                هیچ ثبت‌نامی وجود ندارد.
              </li>
            )}
          </ul>
        </section>

        {/* ======== گواهینامه‌ها ======== */}
        <section aria-labelledby="certs-title" className="mt-10">
          <h2 id="certs-title" className="flex items-center gap-2 text-xl font-black">
            <Award size={20} className="text-gold-primary" aria-hidden />
            گواهینامه‌ها ({certificates.length.toLocaleString("fa-IR")})
          </h2>
          <ul className="mt-4 space-y-3">
            {certificates.map((cert) => (
              <li
                key={cert.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dark-border bg-dark-card p-4"
              >
                <div>
                  <p className="font-bold">{cert.courseTitle}</p>
                  <p className="mt-1 text-xs text-slate-500" dir="ltr">
                    {cert.readableCode}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {cert.studentName} — صدور: {formatJalaliDate(cert.issuedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {cert.status === "active" ? (
                    <>
                      <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                        فعال
                      </span>
                      {/* اکشن ابطال — بعد از اتصال API واقعی فعال می‌شود */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-300 opacity-50"
                        title="در نسخه استاتیک غیرفعال است"
                      >
                        <Ban size={13} aria-hidden />
                        ابطال
                      </span>
                    </>
                  ) : (
                    <span className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300">
                      باطل‌شده
                    </span>
                  )}
                  <Link
                    href={`/admin/training/scans/${cert.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-primary hover:underline"
                  >
                    <FileText size={14} aria-hidden />
                    گزارش اسکن
                  </Link>
                </div>
              </li>
            ))}
            {certificates.length === 0 && (
              <li className="rounded-2xl border border-dark-border bg-dark-card p-6 text-center text-sm text-slate-500">
                هنوز گواهینامه‌ای صادر نشده است.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
