import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Landmark,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
} from "lucide-react";
import { trainingDatabase } from "@/lib/training/mock-db";
import {
  COURSE_CATEGORY_LABELS,
  COURSE_STATUS_LABELS,
  serializeDate,
} from "@/lib/training/types";
import { VerifySerialForm } from "@/components/training/verify-serial-form";

export const metadata: Metadata = {
  title: "مرکز آموزش و گواهینامه جام جم",
  description:
    "دوره‌های آموزش تکنسین و کارآموز آسانسور شرکت جام جم و استعلام اصالت گواهینامه‌ها",
};

export const dynamic = "force-dynamic";

const CATEGORY_ACCENTS: Record<string, { badge: string; dot: string }> = {
  technician: {
    badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  apprentice: {
    badge: "bg-sky-400/10 text-sky-300 border-sky-400/30",
    dot: "bg-sky-400",
  },
  safety: {
    badge: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    dot: "bg-amber-400",
  },
  maintenance: {
    badge: "bg-violet-400/10 text-violet-300 border-violet-400/30",
    dot: "bg-violet-400",
  },
  modernization: {
    badge: "bg-rose-400/10 text-rose-300 border-rose-400/30",
    dot: "bg-rose-400",
  },
};

const STATUS_STYLES: Record<string, string> = {
  open: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  upcoming: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  closed: "border-white/10 bg-white/5 text-neutral-400",
};

function StatCounter({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition hover:border-emerald-400/40">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-black leading-none text-white" dir="ltr">
          {value}
        </p>
        <p className="mt-2 text-[11px] font-medium text-neutral-400 sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}

function faNumber(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function TrainingPortalPage() {
  const { courses, certificates } = trainingDatabase;
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.status === b.status) return a.startDate.localeCompare(b.startDate);
    const order = { open: 0, upcoming: 1, closed: 2 } as const;
    return order[a.status] - order[b.status];
  });

  const activeCourses = courses.filter((c) => c.status !== "closed").length;
  const certifiedTechnicians = certificates.filter(
    (c) => c.status === "valid",
  ).length;
  const totalHours = courses.reduce((sum, c) => sum + c.durationHours, 0);
  const totalSeats = courses.reduce((sum, c) => sum + c.capacity, 0);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-100"
    >
      {/* Emerald ambient glows */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 left-0 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        {/* ---------- Hero ---------- */}
        <section className="overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-bl from-emerald-500/10 via-white/[0.03] to-transparent p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-bold tracking-wide text-emerald-300 sm:text-xs">
              <ShieldCheck size={14} />
              JAM JAM ELEVATOR ACADEMY
            </span>
            <h1 className="mt-6 text-3xl font-black leading-[1.4] text-white sm:text-4xl lg:text-5xl">
              مرکز آموزش و گواهینامه تخصصی آسانسور جام جم
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-neutral-300 sm:text-base sm:leading-8">
              تربیت تکنسین و کارآموز متخصص آسانسور با آموزش عملی،
              استاندارد‌محور و مدرک رسمی قابل استعلام — از نصب و نگهداری تا
              ایمنی و نوسازی، با کد QR اختصاصی روی هر گواهینامه.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-emerald-400"
              >
                <BookOpen size={16} />
                مشاهده دوره‌ها
              </Link>
              <a
                href="#verify"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-neutral-200 transition hover:border-emerald-400/50 hover:text-white"
              >
                استعلام گواهینامه
              </a>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCounter
              icon={<BookOpen size={22} />}
              value={faNumber(activeCourses)}
              label="دوره فعال و پیش‌رو"
            />
            <StatCounter
              icon={<Award size={22} />}
              value={faNumber(certifiedTechnicians)}
              label="تکنسین گواهینامه‌دار"
            />
            <StatCounter
              icon={<Clock size={22} />}
              value={faNumber(totalHours)}
              label="ساعت آموزش تخصصی"
            />
            <StatCounter
              icon={<Users size={22} />}
              value={faNumber(totalSeats)}
              label="ظرفیت آموزشی کل"
            />
          </div>
        </section>

        {/* ---------- Certificate verification ---------- */}
        <section id="verify" className="mx-auto mt-14 max-w-3xl scroll-mt-24">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <ShieldCheck size={26} />
              </span>
              <h2 className="text-xl font-black text-white sm:text-2xl">
                استعلام اصالت گواهینامه
              </h2>
              <p className="max-w-md text-xs leading-7 text-neutral-400 sm:text-sm">
                شماره سریال مندرج روی گواهینامه را وارد کنید تا نتیجه استعلام
                رسمی نمایش داده شود (نمونه:{" "}
                <span dir="ltr" className="font-mono">
                  JJ-CERT-1404-000101
                </span>
                )
              </p>
            </div>
            <div className="mt-6">
              <VerifySerialForm />
            </div>
            <p className="mt-5 text-center text-[11px] leading-6 text-neutral-500">
              گواهینامه‌های جام جم دارای کد QR اختصاصی هستند؛ اسکن QR نیز شما را
              به همین استعلام می‌رساند.
            </p>
          </div>
        </section>

        {/* ---------- Courses ---------- */}
        <section id="courses" className="mt-16 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-400">
                COURSES
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                دوره‌های آموزشی
              </h2>
            </div>
            <Link
              href="/contact"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              ثبت‌نام و تماس با مدیریت ←
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedCourses.map((course) => {
              const accent =
                CATEGORY_ACCENTS[course.category] ?? CATEGORY_ACCENTS.technician;
              const closed = course.status === "closed";
              return (
                <article
                  key={course.id}
                  className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-950/30"
                >
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${accent.badge}`}
                    >
                      {COURSE_CATEGORY_LABELS[course.category]}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-bold ${STATUS_STYLES[course.status]}`}
                    >
                      {COURSE_STATUS_LABELS[course.status]}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black leading-8 text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-neutral-400">
                    {course.description}
                  </p>

                  {/* Meta grid */}
                  <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 text-[11px]">
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <Clock size={14} className="shrink-0 text-emerald-400" />
                      <span className="text-neutral-300">
                        {faNumber(course.durationHours)} ساعت /{" "}
                        {faNumber(course.sessionsCount)} جلسه
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <GraduationCap
                        size={14}
                        className="shrink-0 text-emerald-400"
                      />
                      <span className="truncate text-neutral-300">
                        مدرس: {course.instructor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-emerald-400"
                      />
                      <span className="text-neutral-300">
                        شروع: {serializeDate(course.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
                      <MapPin size={14} className="shrink-0 text-emerald-400" />
                      <span className="truncate text-neutral-300">
                        {course.location}
                      </span>
                    </div>
                  </dl>

                  {/* Capacity bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">
                        ظرفیت باقی‌مانده
                      </span>
                      <span className="font-bold text-neutral-200">
                        {faNumber(course.capacity)} نفر
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600"
                        style={{
                          width: closed ? "100%" : "72%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Price + action */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-neutral-500">شهریه دوره</p>
                      <p className="mt-1 truncate text-sm font-black text-emerald-300">
                        {new Intl.NumberFormat("fa-IR").format(course.tuition)}{" "}
                        <span className="text-[11px] font-bold">تومان</span>
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      aria-disabled={closed}
                      className={`shrink-0 rounded-xl px-5 py-2.5 text-xs font-black transition ${closed
                        ? "cursor-not-allowed border border-white/10 text-neutral-500"
                        : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                        }`}
                    >
                      {closed ? "برگزار شد" : "ثبت‌نام در دوره"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="mt-16 overflow-hidden rounded-[2rem] border border-emerald-400/20 p-8 text-center backdrop-blur-xl sm:p-12"
          style={{
            background:
              "radial-gradient(circle at top, rgba(16,185,129,0.12), transparent 60%), rgba(255,255,255,0.03)",
          }}
        >
          <Landmark className="mx-auto text-emerald-400" size={36} />
          <h2 className="mt-4 text-xl font-black text-white sm:text-2xl">
            برای ثبت‌نام یا راه‌اندازی دوره سازمانی با مدیریت آموزش تماس بگیرید
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-neutral-400">
            دوره‌های اختصاصی برای شرکت‌های خدمات آسانسور، ساختمان‌داری و
            تعاونی‌های مسکن با ظرفیت و سرفصل دلخواه شما برگزار می‌شود.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-neutral-950 transition hover:bg-emerald-400"
            >
              <PhoneCall size={16} /> تماس و ثبت‌نام
            </Link>
            <a
              href="tel:+982155000000"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-neutral-200 transition hover:border-emerald-400/50 hover:text-white"
            >
              ۰۲۱-۵۵۰۰۰۰۰۰
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
