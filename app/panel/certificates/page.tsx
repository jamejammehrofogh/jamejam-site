/**
 * صفحه گواهینامه‌های دانشجو — /panel/certificates
 *
 * برای هر دوره تکمیل‌شده، گواهینامه صادر/بازیابی می‌شود (صدور idempotent:
 * برای هر (studentId, courseId) فقط یک گواهینامه وجود دارد).
 *
 * نمایش: کارت گواهینامه قابل چاپ با CSS چاپ (@media print)،
 * QR کد ساخته‌شده در سرور (بسته qrcode) با لینک استعلام،
 * دکمه «چاپ» و «دانلود PDF».
 */

import type { Metadata } from "next";

import QRCode from "qrcode";
import { Award } from "lucide-react";

import { CertificateActions } from "@/components/certificates/certificate-actions";
import { getEnrollmentsByStudent } from "@/lib/auth/db";
import { getSession } from "@/lib/auth/session";

import { issueCertificate } from "@/lib/certificates/issue";
import { formatJalaliDate } from "@/lib/certificates/jalali";
import { createCertificateToken } from "@/lib/certificates/token";

export const metadata: Metadata = { title: "گواهینامه‌های من" };

/** دامنه سایت برای ساخت لینک QR (از متغیر محیطی یا هدرها) */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export default async function CertificatesPage() {
  // خروجی استاتیک: کوکی در زمان build در دسترس نیست؛ در build پوسته «وارد شوید» رندر می‌شود
  let session = null;
  try {
    session = await getSession();
  } catch {
    session = null;
  }
  if (!session) return <CertificatesLoginRequired />;

  // ۱) دوره‌های تکمیل‌شده دانشجو
  const enrollments = await getEnrollmentsByStudent(session.sub);
  const completed = enrollments.filter((row) => row.completed);

  // ۲) برای هر دوره تکمیل‌شده گواهینامه صادر کن (اگر قبلاً نبوده)
  const certificates = [];
  for (const enrollment of completed) {
    const { certificate } = await issueCertificate({
      studentId: session.sub,
      courseId: enrollment.courseId,
      studentName: session.name,
      courseTitle: enrollment.courseTitle,
    });
    // توکن امنیتی برای لینک QR
    const token = await createCertificateToken(certificate.id);
    const verifyUrl = `${getBaseUrl()}/verify/${certificate.id}?t=${token}`;
    // QR به‌صورت data URL در سرور ساخته می‌شود (SVG نه — PNG ساده‌تر برای چاپ)
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 240,
      margin: 1,
      color: { dark: "#0A0A0C", light: "#ffffff" },
    });
    certificates.push({ certificate, qrDataUrl, verifyUrl });
  }

  if (certificates.length === 0) {
    return (
      <main className="min-h-[80vh] bg-dark-bg px-4 py-16 text-center text-ink">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg">
          <Award size={28} aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-black">گواهینامه‌های من</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">
          هنوز گواهینامه‌ای ندارید. پس از تکمیل هر دوره، گواهینامه شما به‌صورت خودکار
          در همین صفحه ظاهر می‌شود.
        </p>
        <a
          href="/panel"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3 text-sm font-bold text-dark-bg"
        >
          بازگشت به داشبورد
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-dark-bg px-4 py-12 text-ink sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-black sm:text-3xl">گواهینامه‌های من</h1>
        <p className="mt-2 text-sm text-slate-400">
          با اسکن QR کد یا مراجعه به لینک زیر کارت، اصالت مدرک قابل استعلام است.
        </p>

        <div className="mt-8 space-y-10">
          {certificates.map(({ certificate, qrDataUrl }) => (
            <section
              key={certificate.id}
              className="cert-sheet rounded-3xl border-2 border-gold-primary/40 bg-dark-card p-8 shadow-card sm:p-10"
              data-cert-id={certificate.id}
            >
              {/* سربرگ گواهینامه */}
              <header className="text-center">
                <p className="text-xs font-bold tracking-widest text-gold-primary">
                  شرکت آسانسور جام جم
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  JAM JAM ELEVATOR CO. — TRAINING &amp; CERTIFICATION
                </p>
                <h2 className="mt-6 text-3xl font-black text-gold-primary sm:text-4xl">
                  گواهینامه
                </h2>
                <p className="mt-2 text-sm text-slate-400">Certificate of Completion</p>
              </header>

              {/* بدنه */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">بدین‌وسیله تأیید می‌گردد</p>
                <p className="mt-3 text-2xl font-black sm:text-3xl">{certificate.studentName}</p>
                <p className="mt-4 text-sm text-slate-400">دوره آموزشی زیر را با موفقیت به پایان رسانده است:</p>
                <p className="mt-3 text-xl font-extrabold text-ink sm:text-2xl">
                  {certificate.courseTitle}
                </p>
              </div>

              {/* پانوشت: تاریخ، شماره مدرک و QR */}
              <footer className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-dark-border pt-6 sm:flex-row sm:items-end">
                <div className="text-center text-sm sm:text-right">
                  <p className="text-slate-500">تاریخ صدور</p>
                  <p className="mt-1 font-bold">{formatJalaliDate(certificate.issuedAt)}</p>
                </div>
                <div className="text-center text-sm sm:text-center">
                  <p className="text-slate-500">شماره مدرک</p>
                  <p className="mt-1 font-bold" dir="ltr">
                    {certificate.readableCode}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  {/* QR ساخته‌شده در سرور */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR کد استعلام گواهینامه ${certificate.readableCode}`}
                    width={120}
                    height={120}
                    className="rounded-xl bg-white p-1"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">استعلام اصالت</p>
                </div>
              </footer>

              {/* دکمه‌های چاپ و PDF — فقط در نمایش صفحه، در چاپ پنهان می‌شوند */}
              <div className="no-print mt-8 flex justify-center gap-3">
                <CertificateActions certId={certificate.id} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function CertificatesLoginRequired() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-dark-bg px-4 text-ink">
      <div className="w-full max-w-md rounded-3xl border border-dark-border bg-dark-card p-8 text-center shadow-card">
        <Award size={40} className="mx-auto text-gold-primary" aria-hidden />
        <h1 className="mt-4 text-xl font-black">برای دیدن گواهینامه‌ها وارد شوید</h1>
        <p className="mt-2 text-sm text-slate-400">
          نشست فعلی پیدا نشد. لطفاً از صفحه ورود وارد حساب خود شوید.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3 text-sm font-black text-dark-bg"
        >
          ورود به پنل
        </a>
      </div>
    </main>
  );
}
