/**
 * صفحه ورود ادمین — /admin/login
 * جدا از لاگین دانشجو (/login) و با کوکی جداگانه.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = { title: "ورود ادمین", robots: { index: false } };

export default async function AdminLoginPage() {
  // ادمینِ لاگین‌شده نیازی به این صفحه ندارد
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-4 text-ink">
      <div className="w-full max-w-sm rounded-3xl border border-dark-border bg-dark-card p-8 shadow-card">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg">
            <ShieldCheck size={28} aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-black">ورود مدیر آموزش</h1>
          <p className="mt-2 text-xs text-slate-500">
            این بخش ویژه کارکنان شرکت آسانسور جام جم است.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
