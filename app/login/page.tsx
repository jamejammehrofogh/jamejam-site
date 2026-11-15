"use client";

/**
 * صفحه ورود و ثبت‌نام — /login
 * یک فرم با دو حالت: «ورود» و «ثبت‌نام» (با کلیک روی تب، بین آن‌ها سوئیچ می‌شود).
 * فیلدهای ثبت‌نام: نام، شماره موبایل، رمز عبور.
 * فیلدهای ورود: شماره موبایل، رمز عبور.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { GraduationCap, Loader2 } from "lucide-react";

type Mode = "login" | "register";

// تبدیل ارقام فارسی به لاتین قبل از ارسال به سرور
function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // بعد از ورود، کاربر باید به همین مسیر برگردد (مثلاً دوره‌ای که می‌خواست ثبت‌نام کند)
  const nextPath = searchParams.get("next") ?? "/panel";
  // اگر با دکمه ثبت‌نام دوره آمده: بعد از ورود، همان دوره را ثبت کنیم
  const courseParam = searchParams.get("course");

  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** اعتبارسنجی سمت کاربر — پیام‌ها فارسی هستند */
  function validate(): string | null {
    if (mode === "register" && fullName.trim().length < 3) {
      return "لطفاً نام و نام خانوادگی را کامل وارد کنید (حداقل ۳ حرف).";
    }
    const normalized = toLatinDigits(phone).replace(/[\s-]+/g, "");
    if (!/^09\d{9}$/.test(normalized)) {
      return "شماره موبایل معتبر نیست. مثال صحیح: 09123456789";
    }
    if (password.length < 8) {
      return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    }
    if (mode === "register") {
      if (!/[a-zA-Zآ-ی]/.test(password)) {
        return "رمز عبور باید حداقل یک حرف داشته باشد.";
      }
      if (!/\d/.test(password)) {
        return "رمز عبور باید حداقل یک رقم داشته باشد.";
      }
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: toLatinDigits(phone).replace(/[\s-]+/g, ""),
          password,
        }),
      });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setError(data.message ?? "خطایی رخ داد. دوباره تلاش کنید.");
        setLoading(false);
        return;
      }

      // اگر با ?course=... آمده بودیم، بعد از ورود در همان دوره ثبت‌نام کنیم
      if (courseParam) {
        const titles: Record<string, string> = {
          basics: "مبانی آسانسور",
          install: "نصب و راه‌اندازی",
          maintenance: "سرویس و نگهداری دوره‌ای",
          safety: "ایمنی و بازرسی",
          repair: "تعمیرات و عیب‌یابی",
        };
        await fetch("/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId: courseParam, courseTitle: titles[courseParam] }),
        });
      }

      router.replace(nextPath); // برو به پنل (یا مسیر قبلی)
      router.refresh(); // تا کامپوننت‌های سرور هم نشست جدید را ببینند
    } catch {
      setError("ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] bg-dark-bg text-ink">
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg">
            <GraduationCap size={28} aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-black sm:text-3xl">
            {mode === "login" ? "ورود به پنل دانشجو" : "ساخت حساب دانشجو"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "login"
              ? "با شماره موبایل و رمز عبور خود وارد شوید."
              : "در چند ثانیه عضو واحد آموزش جام جم شوید."}
          </p>
        </div>

        {/* تب‌های ورود / ثبت‌نام */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-dark-border bg-dark-card p-1">
          {(["login", "register"] as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setError(null);
              }}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${mode === item
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg"
                : "text-slate-400 hover:text-ink"
                }`}
            >
              {item === "login" ? "ورود" : "ثبت‌نام"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-dark-border bg-dark-card p-6 shadow-card"
        >
          {mode === "register" && (
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-bold text-slate-200">
                نام و نام خانوادگی
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: علی محمدی"
                className="w-full rounded-xl border border-dark-border bg-[#0f1115] px-4 py-3 text-sm text-ink outline-none transition focus:border-brand"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-200">
              شماره موبایل
            </label>
            <input
              id="phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full rounded-xl border border-dark-border bg-[#0f1115] px-4 py-3 text-left text-sm text-ink outline-none transition focus:border-brand"
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-200">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۸ کاراکتر شامل حرف و رقم"
              className="w-full rounded-xl border border-dark-border bg-[#0f1115] px-4 py-3 text-left text-sm text-ink outline-none transition focus:border-brand"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          {/* نمایش خطاها به فارسی */}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3.5 text-sm font-black text-dark-bg transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" aria-hidden />
                لطفاً صبر کنید…
              </>
            ) : mode === "login" ? (
              "ورود"
            ) : (
              "ساخت حساب و ورود"
            )}
          </button>

          <p className="text-center text-xs text-slate-500">
            {mode === "login" ? "حساب ندارید؟ " : "قبلاً ثبت‌نام کرده‌اید؟ "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
              }}
              className="font-bold text-gold-primary hover:underline"
            >
              {mode === "login" ? "ثبت‌نام کنید" : "وارد شوید"}
            </button>
          </p>
        </form>

        <Link
          href="/courses"
          className="mt-6 text-center text-sm text-slate-400 transition hover:text-gold-primary"
        >
          ← بازگشت به فهرست دوره‌ها
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    // useSearchParams در build به Suspense نیاز دارد
    <Suspense fallback={<div className="min-h-[80vh] bg-dark-bg" />}>
      <LoginForm />
    </Suspense>
  );
}
