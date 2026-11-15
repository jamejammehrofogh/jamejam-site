"use client";

import { useEffect, useState } from "react";
import { Download, QrCode } from "lucide-react";
import { downloadCertificatePdf, qrDataUrl } from "@/lib/training/helpers";
import { serializeDate } from "@/lib/training/types";

export interface DashboardCertificate {
  serial: string;
  studentName: string;
  courseTitle: string;
  durationHours: number;
  issueDate: string;
  grade: string;
  status: "valid" | "revoked";
}

export function CertificateQrGrid({
  certificates,
}: {
  certificates: DashboardCertificate[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {certificates.map((certificate) => (
        <CertificateQrCard key={certificate.serial} certificate={certificate} />
      ))}
    </div>
  );
}

function CertificateQrCard({
  certificate,
}: {
  certificate: DashboardCertificate;
}) {
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const revoked = certificate.status === "revoked";

  useEffect(() => {
    let active = true;
    qrDataUrl(
      `${window.location.origin}/training/verify/${encodeURIComponent(certificate.serial)}`,
    ).then((dataUrl) => {
      if (active) setQr(dataUrl);
    });
    return () => {
      active = false;
    };
  }, [certificate.serial]);

  async function download() {
    setBusy(true);
    try {
      await downloadCertificatePdf({
        serial: certificate.serial,
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        durationHours: certificate.durationHours,
        issueDate: certificate.issueDate,
        completionDate: certificate.issueDate,
        grade: certificate.grade,
        revoked,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      className={`flex items-start gap-4 rounded-3xl border p-5 backdrop-blur-xl transition ${revoked
        ? "border-red-500/30 bg-red-500/[0.04]"
        : "border-white/10 bg-white/[0.04] hover:border-emerald-400/40"
        }`}
    >
      <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white p-1.5">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qr} alt={`کد QR گواهینامه ${certificate.serial}`} className="h-full w-full" />
        ) : (
          <QrCode size={28} className="animate-pulse text-neutral-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black leading-7 text-white">
            {certificate.courseTitle}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${revoked
              ? "border-red-500/40 bg-red-500/10 text-red-300"
              : "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              }`}
          >
            {revoked ? "ابطال‌شده" : "معتبر"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-neutral-400">
          تاریخ صدور: {serializeDate(certificate.issueDate)} · ارزیابی:{" "}
          {certificate.grade}
        </p>
        <p dir="ltr" className="mt-2 text-right font-mono text-[11px] tracking-wider text-emerald-300">
          {certificate.serial}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={`/training/verify/${encodeURIComponent(certificate.serial)}`}
            className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-bold text-neutral-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
          >
            صفحه استعلام
          </a>
          <button
            type="button"
            onClick={download}
            disabled={busy || !certificate.studentName}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-[11px] font-black text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
          >
            <Download size={13} /> {busy ? "در حال آماده‌سازی…" : "دانلود PDF"}
          </button>
        </div>
      </div>
    </article>
  );
}
