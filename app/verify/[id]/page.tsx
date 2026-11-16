
"use client";

/**
 * صفحه عمومی استعلام گواهینامه — /verify/[id]?t=<token>
 * نسخه استاتیک: اعتبارسنجی HMAC، rate-limit و لاگ اسکن به یک API واقعی
 * (Cloudflare Worker + KV) منتقل می‌شود. فعلاً هیچ شناسه‌ای از قبل تولید نمی‌شود.
 */

import { BadgeCheck, ShieldAlert } from "lucide-react";

export function generateStaticParams() {
  return [];
}

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-4 py-10 text-ink">
      <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-amber-500/40 bg-[#101216] p-8 text-center shadow-card sm:p-10">
        <ShieldAlert size={48} aria-hidden />
        <h1 className="mt-4 text-2xl font-black">استعلام موقتاً غیرفعال است</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          استعلام آنلاین اصالت گواهینامه در نسخه استاتیک سایت هنوز فعال نشده است.
          برای استعلام اصالت، با شماره ثبت‌شده روی خود گواهینامه با واحد آموزش
          شرکت آسانسور جام جم تماس بگیرید.
        </p>
        <span className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300">
          <BadgeCheck size={15} aria-hidden />
          استعلام بعد از اتصال بک‌اند فعال می‌شود
        </span>
      </div>
    </main>
  );
}
