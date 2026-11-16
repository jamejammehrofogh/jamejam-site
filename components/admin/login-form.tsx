"use client";

/**
 * فرم ورود ادمین — کلاینت کامپوننت با پیام‌های خطای فارسی.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /** اعتبارسنجی ساده سمت کاربر */
  function validate(): string | null {
    if (username.trim().length < 3) return "نام کاربری باید حداقل ۳ کاراکتر باشد.";
    if (password.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // نسخه استاتیک: API ادمین موقتاً غیرفعال است
      setError("ورود ادمین در نسخه استاتیک فعلاً غیرفعال است؛ پس از اتصال بک‌اند فعال می‌شود.");
      setLoading(false);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-username" className="mb-2 block text-sm font-bold text-slate-200">
          نام کاربری
        </label>
        <input
          id="admin-username"
          type="text"
          dir="ltr"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-dark-border bg-[#0f1115] px-4 py-3 text-left text-sm outline-none focus:border-brand"
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-slate-200">
          رمز عبور
        </label>
        <input
          id="admin-password"
          type="password"
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-dark-border bg-[#0f1115] px-4 py-3 text-left text-sm outline-none focus:border-brand"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300"
        >
          <ShieldAlert size={16} aria-hidden />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3 text-sm font-black text-dark-bg transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            در حال بررسی…
          </>
        ) : (
          "ورود به پنل مدیریت"
        )}
      </button>
    </form>
  );
}
