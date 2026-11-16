/**
 * Layout بخش آموزش ادمین — /admin/training/*
 * خروجی استاتیک: چک کوکی در زمان build ممکن نیست؛ محافظت توسط middleware/کلاینت انجام می‌شود.
 */

export default function AdminTrainingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
