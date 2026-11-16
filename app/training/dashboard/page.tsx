import type { Metadata } from "next";
import Link from "next/link";

import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  Fingerprint,
  GraduationCap,
  IdCard,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SESSION_COOKIE, getStudentSession, resolveSession } from "@/lib/training/students";
import { COURSE_STATUS_LABELS, serializeDate } from "@/lib/training/types";
import { CertificateQrGrid } from "@/components/training/certificate-qr-grid";
import { LogoutButton } from "@/components/training/logout-button";

export const metadata: Metadata = {
  title: "داشبورد دانشجو — مرکز آموزش جام جم",
  description: "دوره‌ها، پیشرفت آموزشی و گواهینامه‌های شخصی",
};

// خروجی استاتیک
export const dynamicParams = false;
export function generateStaticParams() {
  return [];
}

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  active: {
    text: "فعال",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  graduated: {
    text: "دانش‌آموخته",
    className: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  },
  suspended: {
    text: "موقتاً غیرفعال",
    className: "border-red-500/40 bg-red-500/10 text-red-300",
  },
};

function faNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function DashboardLoginRequired() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100"
    >
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl">
        <ShieldAlert className="mx-auto text-amber-300" size={40} />
        <h1 className="mt-4 text-xl font-black">برای دیدن داشبورد وارد شوید</h1>
        <p className="mt-2 text-sm text-neutral-400">
          نشست فعلی پیدا نشد. لطفاً از صفحه ورود دانشجویان وارد شوید.
        </p>
        <Link
          href="/training/login"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-emerald-400"
        >
          ورود به داشبورد
        </Link>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  // خروجی استاتیک: کوکی در زمان build در دسترس نیست؛ تشخیص نشست در سمت کلاینت انجام می‌شود
  return <DashboardLoginRequired />;
}

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, prefer-const */
async function __unusedStaticShell() {
  let student: any = null;
  if (!student) {
    return null;
  }

  const { student: profile, courses, certificates } = getStudentSession(student);
  const status = STATUS_LABELS[profile.status] ?? STATUS_LABELS.active;
  const completedCourses = courses.filter(
    (course) => (profile.progress[course.id] ?? 0) >= 100,
  ).length;

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100"
    >
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {/* ---------- Header ---------- */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/training" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-lg font-black text-neutral-950">
              ج
            </span>
            <span>
              <span className="block text-sm font-extrabold text-white">
                داشبورد دانشجو — جام جم
              </span>
              <span className="mt-1 block text-[11px] text-neutral-400">
                مرکز آموزش و گواهینامه تخصصی
              </span>
            </span>
          </Link>
          <LogoutButton />
        </header>

        {/* ---------- Profile ---------- */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-bl from-emerald-500/10 via-white/[0.03] to-transparent p-7 backdrop-blur-xl sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <UserRound size={30} />
              </span>
              <div>
                <h1 className="text-xl font-black text-white sm:text-2xl">
                  {profile.fullName}
                </h1>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${status.className}`}
                >
                  <ShieldCheck size={12} /> {status.text}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MiniStat
                icon={<BookOpen size={18} />}
                value={faNumber(courses.length)}
                label="دوره من"
              />
              <MiniStat
                icon={<Award size={18} />}
                value={faNumber(
                  certificates.filter((c) => c.status === "valid").length,
                )}
                label="گواهینامه معتبر"
              />
              <MiniStat
                icon={<GraduationCap size={18} />}
                value={faNumber(completedCourses)}
                label="دوره تکمیل‌شده"
              />
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ProfileField
              icon={<Fingerprint size={16} />}
              label="کد ملی"
              value={profile.nationalId}
              ltr
            />
            <ProfileField
              icon={<Phone size={16} />}
              label="شماره موبایل"
              value={profile.phone}
              ltr
            />
            <ProfileField
              icon={<IdCard size={16} />}
              label="شناسه حساب"
              value={profile.id}
              ltr
            />
          </dl>
        </section>

        {/* ---------- Enrolled courses ---------- */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-black text-white">
            <BookOpen size={20} className="text-emerald-400" /> دوره‌های من
          </h2>
          {courses.length === 0 ? (
            <EmptyState text="هنوز در دوره‌ای ثبت‌نام نکرده‌اید." />
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {courses.map((course) => {
                const progress = profile.progress[course.id] ?? 0;
                const done = progress >= 100;
                return (
                  <article
                    key={course.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-emerald-400/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-black leading-7 text-white">
                        {course.title}
                      </h3>
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-neutral-300">
                        {COURSE_STATUS_LABELS[course.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-400">
                      مدرس: {course.instructor}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-emerald-400" />
                        {serializeDate(course.startDate)} تا{" "}
                        {serializeDate(course.endDate)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-400" />
                        {faNumber(course.durationHours)} ساعت
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">پیشرفت دوره</span>
                        <span
                          className={`font-black ${done ? "text-emerald-300" : "text-neutral-200"}`}
                        >
                          {faNumber(progress)}٪
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${done
                            ? "bg-gradient-to-l from-emerald-400 to-emerald-600"
                            : "bg-gradient-to-l from-amber-400 to-emerald-500"
                            }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ---------- Certificates ---------- */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl font-black text-white">
            <Award size={20} className="text-emerald-400" /> گواهینامه‌ها و کدهای QR
          </h2>
          {certificates.length === 0 ? (
            <EmptyState text="پس از تکمیل دوره، گواهینامه شما در این بخش نمایش داده می‌شود." />
          ) : (
            <div className="mt-5">
              <CertificateQrGrid
                certificates={certificates.map((certificate) => ({
                  serial: certificate.serial,
                  studentName: student.fullName,
                  courseTitle: certificate.courseTitle,
                  durationHours: certificate.durationHours,
                  issueDate: certificate.issueDate,
                  grade: certificate.grade,
                  status: certificate.status,
                }))}
              />
              {certificates.some((c) => c.status === "revoked") && (
                <p className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-4 text-xs leading-6 text-red-200">
                  <ShieldAlert size={16} className="shrink-0" />
                  برخی گواهینامه‌ها ابطال شده‌اند و به‌عنوان مدرک معتبر پذیرفته
                  نمی‌شوند.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
        {icon}
      </span>
      <div>
        <p className="text-lg font-black leading-none text-white">{value}</p>
        <p className="mt-1.5 text-[10px] text-neutral-400">{label}</p>
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  ltr = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-emerald-300">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] text-neutral-500">{label}</dt>
        <dd
          dir={ltr ? "ltr" : undefined}
          className={`mt-1 truncate text-sm font-bold text-white ${ltr ? "text-right font-mono tracking-wider" : ""}`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="mt-5 rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-xs leading-7 text-neutral-500">
      {text}
    </p>
  );
}
