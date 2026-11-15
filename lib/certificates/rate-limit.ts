/**
 * محدودکننده نرخ درخواست (rate limiter) در حافظه — برای مسیر /verify.
 * هدف: جلوگیری از حملات حدس توکن و اسپم کردن سرور.
 * ساده و بدون وابستگی: Map از IP به لیست زمان‌های درخواست.
 */

const WINDOW_MS = 60 * 1000; // پنجره ۱ دقیقه‌ای
const MAX_REQUESTS = 10; // حداکثر ۱۰ درخواست در هر دقیقه از هر IP

const globalForRateLimit = globalThis as typeof globalThis & {
  jamJamVerifyHits?: Map<string, number[]>;
};

const hits = globalForRateLimit.jamJamVerifyHits ?? (globalForRateLimit.jamJamVerifyHits = new Map());

/**
 * اگر IP بیش از حد مجاز درخواست زده باشد true برمی‌گردد (یعنی باید بلاک شود).
 * @param ip نشانی IP بازدیدکننده
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t: number) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // پاکسازی دوره‌ای نقشه (وقتی خیلی بزرگ شد)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t: number) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}
