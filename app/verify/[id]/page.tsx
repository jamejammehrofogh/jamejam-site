/**
 * صفحه عمومی استعلام گواهینامه — /verify/[id]?t=<token>
 *
 * منطق دقیق (طبق master spec) به همین ترتیب:
 *  ۱) rate-limit بر اساس IP → اگر زیاد، خطای «تلاش بیش از حد»
 *  ۲) مقایسه توکن با HMAC در زمان ثابت (timingSafeEqual)
 *  ۳) جست‌وجوی گواهینامه در دیتابیس
 *  ۴) اگر نبود → not_found
 *  ۵) اگر باطل شده → revoked
 *  ۶) نمایش نتیجه — نام و عنوان دوره فقط و فقط از دیتابیس خوانده می‌شود
 *
 * هر بار اسکن در certificate_scan_log ثبت می‌شود.
 * بدون نیاز به لاگین؛ بدون نمایش داده شخصی اضافه.
 */

import type { Metadata } from "next";
import { headers } from "next/headers";
import { BadgeCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

import { findCertificateById, logScan } from "@/lib/certificates/db";
import { formatJalaliDateTime } from "@/lib/certificates/jalali";
import { isRateLimited } from "@/lib/certificates/rate-limit";
import { verifyCertificateToken } from "@/lib/certificates/token";

export const metadata: Metadata = {
  title: "استعلام اصالت گواهینامه",
  robots: { index: false }, // صفحات استعلام نباید در گوگل ایندکس شوند
};

// نتیجه‌های ممکن استعلام
type VerifyResult =
  | { kind: "valid"; studentName: string; courseTitle: string; issuedAt: string; readableCode: string }
  | { kind: "revoked"; studentName: string; courseTitle: string; revokedAt: string | null; revokeReason: string | null }
  | { kind: "not_found" }
  | { kind: "invalid_token" }
  | { kind: "rate_limited" };

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t: token } = await searchParams;
  const headerList = await headers();

  // --- اطلاعات درخواست برای rate-limit و لاگ ---
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? "unknown";
  const userAgent = headerList.get("user-agent") ?? "unknown";

  // --- گام ۱: rate limit ---
  if (isRateLimited(ip)) {
    await logScan({
      certificateId: id,
      scannedAt: new Date().toISOString(),
      ip,
      userAgent,
      result: "not_found", // نمی‌خواهیم به مهاجم بگوییم وضعیت واقعی چیست
    });
    return <VerifyView result={{ kind: "rate_limited" }} />;
  }

  // --- گام ۲: مقایسه امن توکن با HMAC ---
  const tokenOk = verifyCertificateToken(id, token ?? null);

  if (!tokenOk) {
    await logScan({
      certificateId: id,
      scannedAt: new Date().toISOString(),
      ip,
      userAgent,
      result: "invalid_token",
    });
    return <VerifyView result={{ kind: "invalid_token" }} />;
  }

  // --- گام ۳ و ۴: جست‌وجو در دیتابیس ---
  const certificate = await findCertificateById(id);
  if (!certificate) {
    await logScan({
      certificateId: id,
      scannedAt: new Date().toISOString(),
      ip,
      userAgent,
      result: "not_found",
    });
    return <VerifyView result={{ kind: "not_found" }} />;
  }

  // --- گام ۵: وضعیت ابطال ---
  if (certificate.status === "revoked") {
    await logScan({
      certificateId: certificate.id,
      scannedAt: new Date().toISOString(),
      ip,
      userAgent,
      result: "revoked",
    });
    return (
      <VerifyView
        result={{
          kind: "revoked",
          studentName: certificate.studentName,
          courseTitle: certificate.courseTitle,
          revokedAt: certificate.revokedAt,
          revokeReason: certificate.revokeReason,
        }}
      />
    );
  }

  // --- گام ۶: نمایش نتیجه معتبر (نام/دوره فقط از دیتابیس) ---
  await logScan({
    certificateId: certificate.id,
    scannedAt: new Date().toISOString(),
    ip,
    userAgent,
    result: "valid",
  });

  return (
    <VerifyView
      result={{
        kind: "valid",
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        issuedAt: certificate.issuedAt,
        readableCode: certificate.readableCode,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* نمایش گرافیکی نتیجه                                                */
/* ------------------------------------------------------------------ */

function VerifyView({ result }: { result: VerifyResult }) {
  if (result.kind === "rate_limited") {
    return (
      <Frame badge="retry">
        <ShieldQuestion size={48} aria-hidden />
        <h1 className="mt-4 text-2xl font-black">تلاش بیش از حد</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه صبر کنید و دوباره
          تلاش کنید.
        </p>
      </Frame>
    );
  }

  if (result.kind === "invalid_token") {
    return (
      <Frame badge="red">
        <ShieldAlert size={48} aria-hidden />
        <h1 className="mt-4 text-2xl font-black">لینک استعلام نامعتبر است</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          نشانی یا امضای امنیتی این لینک درست نیست. لطفاً از QR کد روی خود گواهینامه
          استفاده کنید.
        </p>
      </Frame>
    );
  }

  if (result.kind === "not_found") {
    return (
      <Frame badge="red">
        <ShieldAlert size={48} aria-hidden />
        <h1 className="mt-4 text-2xl font-black">گواهینامه یافت نشد</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          هیچ گواهینامه‌ای با این شناسه در سامانه جام جم ثبت نشده است. احتمال جعل
          مدرک وجود دارد!
        </p>
      </Frame>
    );
  }

  if (result.kind === "revoked") {
    return (
      <Frame badge="red">
        <ShieldAlert size={48} aria-hidden />
        <h1 className="mt-4 text-2xl font-black">این گواهینامه باطل شده است</h1>
        <div className="mt-5 w-full max-w-md rounded-2xl border border-rose-500/30 bg-dark-card p-5 text-right text-sm">
          <Row label="نام دانشجو" value={result.studentName} />
          <Row label="عنوان دوره" value={result.courseTitle} />
          {result.revokedAt && <Row label="تاریخ ابطال" value={formatJalaliDateTime(result.revokedAt)} />}
          {result.revokeReason && <Row label="دلیل ابطال" value={result.revokeReason} />}
        </div>
      </Frame>
    );
  }

  // ---------- نتیجه معتبر ----------
  return (
    <Frame badge="green">
      <BadgeCheck size={48} className="text-emerald-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-black text-emerald-300">گواهینامه معتبر است ✅</h1>
      <p className="mt-2 text-sm text-slate-400">
        این مدرک توسط شرکت آسانسور جام جم صادر شده و اصالت آن تأیید می‌شود.
      </p>

      {/* کارت پیش‌نمایش گواهینامه */}
      <div className="mt-6 w-full max-w-md rounded-3xl border border-emerald-500/30 bg-dark-card p-6 text-right shadow-card">
        <div className="flex items-center justify-between border-b border-dark-border pb-4">
          <span className="text-sm font-black text-gold-primary">شرکت آسانسور جام جم</span>
          <span className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
            معتبر
          </span>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="صادر شده برای" value={result.studentName} highlight />
          <Row label="عنوان دوره" value={result.courseTitle} highlight />
          <Row label="تاریخ صدور" value={formatJalaliDateTime(result.issuedAt)} />
          <Row label="شماره مدرک" value={result.readableCode} dir="ltr" />
        </dl>
      </div>

      <p className="mt-5 text-xs text-slate-500">
        زمان استعلام: {formatJalaliDateTime(new Date().toISOString())}
      </p>
    </Frame>
  );
}

/* ---------- اجزای کوچک کمکی ---------- */

function Frame({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge: "green" | "red" | "retry";
}) {
  const ring =
    badge === "green"
      ? "border-emerald-500/40"
      : badge === "red"
        ? "border-rose-500/40"
        : "border-amber-500/40";
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-4 py-10 text-ink">
      <div
        className={`flex w-full max-w-lg flex-col items-center rounded-3xl border ${ring} bg-[#101216] p-8 text-center shadow-card sm:p-10`}
      >
        {children}
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  highlight = false,
  dir,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  dir?: "ltr";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd
        className={`${highlight ? "font-black text-ink" : "font-bold text-slate-200"} ${dir === "ltr" ? "dir-ltr text-left" : ""}`}
        dir={dir}
      >
        {value}
      </dd>
    </div>
  );
}


