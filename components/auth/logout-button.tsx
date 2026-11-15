"use client";

/**
 * دکمه خروج از حساب — کامپوننت کلاینت.
 * POST به /api/auth/logout می‌زند و کاربر را به صفحه ورود می‌برد.
 */

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

export function LogoutButton({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login"); // برگرد به صفحه ورود
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
    >
      {loading ? "در حال خروج…" : children}
    </button>
  );
}
