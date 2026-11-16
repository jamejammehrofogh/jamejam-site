/**
 * گزارش اسکن گواهینامه — /admin/training/scans/[id]
 * ۲۰ اسکن آخر از certificate_scan_log را نشان می‌دهد.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Activity } from "lucide-react";

import { getCertificates, readScanLog } from "@/lib/certificates/db";
import { formatJalaliDateTime } from "@/lib/certificates/jalali";

export const metadata: Metadata = { title: "گزارش اسکن", robots: { index: false } };

// برچسب فارسی نتیجه اسکن
const RESULT_LABELS: Record<string, string> = {
  valid: "معتبر ✅",
  revoked: "باطل‌شده ⛔",
  not_found: "یافت نشد ❓",
  invalid_token: "توکن نامعتبر ⚠️",
};

const RESULT_COLORS: Record<string, string> = {
  valid: "text-emerald-300",
  revoked: "text-rose-300",
  not_found: "text-slate-400",
  invalid_token: "text-amber-300",
};

// خروجی استاتیک: شناسه‌های گواهینامه از قبل شناخته‌شده نیستند؛
// فعلاً هیچ مسیری از قبل تولید نمی‌شود (گزارش اسکن به نسخه API منتقل می‌شود).
export const dynamicParams = false;
export function generateStaticParams() {
  return [];
}

export default async function ScanLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const certificate = await getCertificates().then((rows) => rows.find((r) => r.id === id));
  if (!certificate) notFound();

  const allScans = await readScanLog();
  // فقط اسکن‌های همین گواهینامه — ۲۰ تای آخر (جدیدترین اول)
  const scans = allScans
    .filter((row) => row.certificateId === id)
    .slice(-20)
    .reverse();

  return (
    <div className="min-h-[80vh] bg-dark-bg text-ink">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/admin/training/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-gold-primary"
        >
          <ArrowRight size={16} aria-hidden />
          بازگشت به داشبورد
        </Link>

        <h1 className="mt-6 flex items-center gap-2 text-2xl font-black">
          <Activity size={22} className="text-gold-primary" aria-hidden />
          گزارش اسکن گواهینامه
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {certificate.courseTitle} — <span dir="ltr">{certificate.readableCode}</span> —{" "}
          {certificate.studentName}
        </p>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-dark-border bg-dark-card">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-dark-border text-xs text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">زمان</th>
                <th className="px-4 py-3 font-bold">IP</th>
                <th className="px-4 py-3 font-bold">مرورگر / دستگاه</th>
                <th className="px-4 py-3 font-bold">نتیجه</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b border-dark-border/50 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatJalaliDateTime(scan.scannedAt)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" dir="ltr">
                    {scan.ip}
                  </td>
                  <td className="max-w-[16rem] truncate px-4 py-3 text-xs text-slate-400" dir="ltr">
                    {scan.userAgent}
                  </td>
                  <td className={`px-4 py-3 text-xs font-bold ${RESULT_COLORS[scan.result] ?? ""}`}>
                    {RESULT_LABELS[scan.result] ?? scan.result}
                  </td>
                </tr>
              ))}
              {scans.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                    هنوز هیچ اسکنی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
