/**
 * Layout پنل دانشجو — /panel/*
 * لایه دوم حائل امنیتی: حتی اگر میدل‌ور را کسی دور بزند،
 * اینجا هم نشست چک می‌شود و مهمان به /login هدایت می‌شود.
 */

import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login"); // مهمان → صفحه ورود
  }
  return <>{children}</>;
}
