"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, LogIn, Smartphone } from "lucide-react";

function normalize(value: string) {
  return value
    .replace(/[۰-۹٠-٩]/g, (d) => {
      const code = d.charCodeAt(0);
      return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
    })
    .replace(/[\s-()+]/g, "");
}

export function StudentLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cleaned = normalize(identifier);
  const looksValid = /^(\d{10}|\d{11})$/.test(cleaned);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!looksValid) {
      setError("شماره موبایل باید ۱۱ رقم و کد ملی ۱۰ رقم باشد.");
      return;
    }
    setBusy(true);
    try {
      // نسخه استاتیک: API آموزش موقتاً غیرفعال است
      setError("ورود دانشجو در نسخه استاتیک فعلاً غیرفعال است؛ پس از اتصال بک‌اند فعال می‌شود.");
      setBusy(false);
    } catch {
      setError("خطای شبکه؛ اتصال اینترنت را بررسی کنید.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8">
      <label
        htmlFor="student-identifier"
        className="mb-2 block text-[11px] font-bold text-neutral-400"
      >
        شماره موبایل یا کد ملی
      </label>
      <div
        className={`flex items-center gap-2 rounded-2xl border bg-white/[0.03] px-4 py-1 transition-colors ${error
          ? "border-red-500/60"
          : looksValid
            ? "border-emerald-500/60"
            : "border-white/15 focus-within:border-emerald-400/70"
          }`}
      >
        <Smartphone
          size={17}
          className={`shrink-0 ${error ? "text-red-400" : looksValid ? "text-emerald-400" : "text-neutral-500"
            }`}
        />
        <input
          id="student-identifier"
          type="text"
          inputMode="numeric"
          autoComplete="username"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setError("");
          }}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا ۰۰۱۲۳۴۵۶۷۸"
          aria-invalid={Boolean(error)}
          dir="ltr"
          className="w-full bg-transparent py-3 text-right font-mono text-sm tracking-wider text-white outline-none placeholder:text-neutral-600"
        />
      </div>

      <div aria-live="polite" className="mt-2 min-h-5 text-xs font-bold">
        {error && (
          <p className="flex items-center gap-1.5 text-red-400">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-neutral-950 transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" /> در حال ورود…
          </>
        ) : (
          <>
            <LogIn size={16} /> ورود به داشبورد
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => router.push("/training")}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-xs font-bold text-neutral-300 transition hover:border-emerald-400/40 hover:text-white"
      >
        <ArrowLeft size={14} /> بازگشت به پرتال آموزش
      </button>
    </form>
  );
}
