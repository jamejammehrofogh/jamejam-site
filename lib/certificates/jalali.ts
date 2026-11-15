/**
 * تبدیل و نمایش تاریخ شمسی (جلالی).
 */

/** تاریخ شمسی کامل مثل «۱۵ آبان ۱۴۰۴» */
export function formatJalaliDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** تاریخ و ساعت شمسی مثل «۱۵ آبان ۱۴۰۴، ساعت ۱۴:۳۲» */
export function formatJalaliDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
