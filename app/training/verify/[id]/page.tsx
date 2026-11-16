import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CalendarClock, Fingerprint, GraduationCap, ShieldAlert, Timer } from "lucide-react";

import { trainingDatabase } from "@/lib/training/mock-db";
import { serializeDate } from "@/lib/training/types";
import { verificationUrl } from "@/lib/training/helpers";
import { CertificateQrCard } from "@/components/training/certificate-qr-card";
import { CertificateStatusBadge } from "@/components/training/certificate-status-badge";

export const dynamicParams = false;
export function generateStaticParams() {
  return trainingDatabase.certificates.map((cert) => ({
    id: encodeURIComponent(cert.serial),
  }));
}

export const metadata: Metadata = {
  title: "استعلام اصالت گواهینامه",
  description: "بررسی اصالت گواهینامه‌های آموزشی شرکت آسانسور جام جم",
};

// خروجی استاتیک — این صفحه دیگر در زمان درخواست رندر نمی‌شود
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decoded = decodeURIComponent(id).trim();

  const certificate =
    trainingDatabase.certificates.find((c) => c.id === decoded) ??
    trainingDatabase.certificates.find(
      (c) => c.serial.toLowerCase() === decoded.toLowerCase(),
    );

  if (!certificate) {
    return <NotFoundView />;
  }

  const revoked = certificate.status === "revoked";
  const course = trainingDatabase.courses.find((c) => c.id === certificate.courseId);

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-[#0a0a0c] px-4 py-10 text-amber-50 sm:px-6">
      <GoldGlow />
      <div className="relative mx-auto w-full max-w-4xl">
        <HeaderLink />

        <div className="mt-6 rounded-3xl border border-[#2a2d35] bg-[#141519]/80 p-6 shadow-card backdrop-blur sm:p-9">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-[#c3a258]">SAMAAHAT — سامانه استعلام جام جم</p>
              <h1 className="mt-2 text-2xl font-black text-amber-50 sm:text-3xl">
                گواهینامه آموزشی {certificate.studentName}
              </h1>
              <p className="mt-2 text-sm text-stone-400">
                نتیجه استعلام رسمی از پایگاه داده شرکت آسانسور جام جم
              </p>
            </div>
            <CertificateStatusBadge status={certificate.status} />
          </div>

          {revoked && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
              <ShieldAlert className="mt-0.5 shrink-0 text-red-400" size={22} />
              <div className="text-sm leading-7 text-red-200">
                <p className="font-black">⚠️ این گواهینامه ابطال شده و دیگر معتبر نیست.</p>
                <p className="mt-1 text-red-200/80">
                  این گواهینامه در تاریخ {serializeDate(certificate.revokedAt ?? certificate.issueDate)} ابطال
                  شده است. دلیل: {certificate.revokeReason ?? "ابطال توسط واحد آموزش."} از پذیرش این گواهینامه
                  به‌عنوان مدرک معتبر خودداری کنید.
                </p>
              </div>
            </div>
          )}

          <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail icon={<GraduationCap size={18} />} label="نام دانشجو" value={certificate.studentName} />
            <Detail icon={<Fingerprint size={18} />} label="شماره سریال یکتا" value={certificate.serial} mono />
            <Detail icon={<BadgeCheck size={18} />} label="عنوان دوره" value={certificate.courseTitle} />
            <Detail icon={<Timer size={18} />} label="مدت دوره (ساعت)" value={`${certificate.durationHours} ساعت`} />
            <Detail icon={<CalendarClock size={18} />} label="تاریخ صدور" value={serializeDate(certificate.issueDate)} />
            <Detail icon={<CalendarClock size={18} />} label="تاریخ اتمام دوره" value={serializeDate(certificate.completionDate)} />
            {certificate.grade && (
              <Detail icon={<BadgeCheck size={18} />} label="ارزیابی" value={certificate.grade} />
            )}
            {course && (
              <Detail icon={<BadgeCheck size={18} />} label="مدرس دوره" value={course.instructor} />
            )}
          </dl>

          <div className="mt-8 grid gap-6 border-t border-[#2a2d35] pt-8 md:grid-cols-[auto_1fr]">
            <CertificateQrCard url={verificationUrl(certificate.serial)} />
            <CertificatePreview certificate={certificate} revoked={revoked} />
          </div>

          <p className="mt-8 text-center text-[11px] leading-6 text-stone-500">
            صحت این استعلام تنها از طریق دامنه رسمی jamjamelevator.ir و پشتیبانی شرکت آسانسور جام جم قابل تأیید است.
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#2a2d35] bg-[#0f1013] p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#c3a258]/10 text-[#d6b66c]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] text-stone-500">{label}</dt>
        <dd className={`mt-1 truncate text-sm font-bold text-amber-50 ${mono ? "font-mono tracking-wider" : ""}`}>
          {value}
        </dd>
      </div>
    </div>
  );
}

function CertificatePreview({ certificate, revoked }: { certificate: { studentName: string; courseTitle: string; serial: string; durationHours: number; issueDate: string; completionDate: string; grade: string }; revoked: boolean }) {
  return (
    <div className="rounded-2xl border border-[#2a2d35] bg-[#0f1013] p-4">
      <p className="mb-3 text-xs font-bold text-stone-400">نمونه تصویر گواهینامه رسمی — برای تطبیق با نسخه چاپی</p>
      <div
        className={`relative overflow-hidden rounded-xl border p-5 text-center ${revoked ? "border-red-500/40 opacity-70" : "border-[#c3a258]/50"}`}
        style={{
          background:
            "radial-gradient(circle at top, rgba(197,162,88,0.18), transparent 55%), linear-gradient(160deg,#12100c,#0c0b09)",
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.3em] text-[#d6b66c]">JAM JAM ELEVATOR CO.</p>
        <div className="mx-auto my-3 h-px w-24 bg-[#c3a258]/60" />
        <p className="text-[11px] text-stone-400">گواهینامه پایان دوره آموزشی</p>
        <p className="mt-3 text-lg font-black text-amber-50">{certificate.studentName}</p>
        <p className="mt-1 text-xs text-stone-300">{certificate.courseTitle}</p>
        <p className="mt-3 font-mono text-[11px] tracking-widest text-[#d6b66c]">{certificate.serial}</p>
        {revoked && (
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 rotate-[-14deg] text-4xl font-black text-red-500/50">
            ابطال شده
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-stone-500">
        کد QR روی نسخه چاپی به همین صفحه اشاره می‌کند؛ در صورت مغایرت تصویر با کاغذ، گواهینامه را جعلی اعلام کنید.
      </p>
    </div>
  );
}

function NotFoundView() {
  return (
    <div dir="rtl" className="relative flex min-h-screen items-center justify-center bg-[#0a0a0c] px-4 text-amber-50">
      <GoldGlow />
      <div className="relative w-full max-w-md rounded-3xl border border-[#2a2d35] bg-[#141519]/80 p-8 text-center shadow-card backdrop-blur">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-red-400">
          <ShieldAlert size={30} />
        </span>
        <h1 className="mt-5 text-xl font-black">گواهینامه‌ای با این شناسه یافت نشد</h1>
        <p className="mt-3 text-sm leading-7 text-stone-400">
          شناسه واردشده در پایگاه داده گواهینامه‌های شرکت آسانسور جام جم ثبت نشده است. این می‌تواند نشانه جعلی بودن
          مدرک یا خطا در شناسه باشد.
        </p>
        <Link
          href="/training"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#c3a258] px-6 py-3 text-sm font-black text-[#17130b] transition hover:bg-[#d6b66c]"
        >
          بازگشت به پرتال آموزش
        </Link>
      </div>
    </div>
  );
}

function HeaderLink() {
  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#c3a258] text-lg font-black text-[#17130b]">ج</span>
        <span>
          <span className="block text-sm font-extrabold text-amber-50">شرکت آسانسور جام جم</span>
          <span className="mt-1 block text-[11px] text-stone-500">سامانه استعلام گواهینامه آموزشی</span>
        </span>
      </Link>
      <Link href="/training" className="rounded-xl border border-[#2a2d35] px-4 py-2 text-xs font-bold text-stone-300 transition hover:border-[#c3a258]/50 hover:text-amber-50">
        پرتال آموزش
      </Link>
    </div>
  );
}

function GoldGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#c3a258]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#c3a258]/5 blur-3xl" />
    </>
  );
}
