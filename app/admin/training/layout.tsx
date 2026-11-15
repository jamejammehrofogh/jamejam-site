/**
 * Layout بخش آموزش ادمین — /admin/training/*
 * دومین لایه امنیتی: علاوه بر middleware، اینجا هم نشست ادمین چک می‌شود.
 * مسیر /admin/login (لاگین) بیرون از این پوشه است و آزاد است.
 */

import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/session";

export default async function AdminTrainingLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
