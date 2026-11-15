"use client";

/**
 * دکمه‌های «چاپ» و «دانلود PDF» روی کارت گواهینامه.
 *
 * کتابخانه PDF: jspdf (که از قبل در پروژه نصب است) به‌همراه html2canvas.
 * چرا این انتخاب؟
 *  ۱) jsPDF سبک، بدون سرور و کاملاً سمت مرورگر است — نیازی به Puppeteer/سرور PDF نیست.
 *  ۲) با html2canvas می‌توان دقیقاً همان ظاهر کارت را (با فونت وزیرمتن و رنگ‌ها)
 *     به‌صورت تصویر در PDF جای داد؛ یعنی PDF هم‌شکل نسخه چاپی می‌شود.
 *  ۳) رندر سمت سرور PDF با ابزارهایی مثل Puppeteer روی هاست اشتراکی سنگین و شکننده است.
 */

import { Printer, Download, Loader2 } from "lucide-react";
import { useState } from "react";

export function CertificateActions({ certId }: { certId: string }) {
  const [loadingPdf, setLoadingPdf] = useState(false);

  /** چاپ مرورگر — فقط همین کارت چاپ می‌شود (CSS چاپ سایر عناصر را حذف می‌کند) */
  function handlePrint() {
    // همه sheetها را مؤقتاً بجز این یکی مخفی نمی‌کنیم؛ سادگی: چاپ کل صفحه
    // (در پروژه‌های تک‌گواهینامه کافی است)
    window.print();
  }

  /** ساخت PDF از کارت گواهینامه با html2canvas + jsPDF */
  async function handleDownloadPdf() {
    setLoadingPdf(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      // پیدا کردن کارت مربوطه در DOM
      const element = document.querySelector(`[data-cert-id="${certId}"]`);
      if (!(element instanceof HTMLElement)) return;

      const canvas = await html2canvas(element, {
        scale: 2, // کیفیت بالاتر برای متن خوانا
        backgroundColor: "#141519", // هم‌رنگ پس‌زمینه کارت
        useCORS: true,
      });

      // A4 landscape چون کارت افقی‌مانند است
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // اندازه تصویر متناسب با صفحه A4
      const imgWidth = pageWidth - 20; // 10mm حاشیه از هر طرف
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const finalHeight = Math.min(imgHeight, pageHeight - 20);

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        10,
        10,
        imgWidth,
        finalHeight,
      );
      pdf.save(`certificate-${certId.slice(0, 8)}.pdf`);
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-xl border border-dark-border bg-[#0f1115] px-5 py-2.5 text-sm font-bold text-slate-200 transition hover:border-brand/50"
      >
        <Printer size={16} aria-hidden />
        چاپ
      </button>
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={loadingPdf}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-5 py-2.5 text-sm font-bold text-dark-bg transition hover:brightness-110 disabled:opacity-60"
      >
        {loadingPdf ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            در حال ساخت PDF…
          </>
        ) : (
          <>
            <Download size={16} aria-hidden />
            دانلود PDF
          </>
        )}
      </button>
    </>
  );
}
