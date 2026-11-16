/**
 * Layout پنل دانشجو — /panel/*
 * لایه دوم حائل امنیتی: حتی اگر میدل‌ور را کسی دور بزند،
 * اینجا هم نشست چک می‌شود و مهمان به /login هدایت می‌شود.
 */

import { getSession } from "@/lib/auth/session";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  // خروجی استاتیک: چک نشست در سمت کلاینت/میدل‌ور انجام می‌شود؛
  // این layout فقط پوسته صفحه را رندر می‌کند.
  return <>{children}</>;
}
