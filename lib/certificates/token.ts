/**
 * توکن امنیتی گواهینامه.
 *
 * token = HMAC-SHA256(certificateUUID, SECRET_KEY)
 *
 * - SECRET_KEY فقط از متغیر محیطی CERTIFICATE_SECRET خوانده می‌شود؛
 *   اگر تعریف نشده باشد خطا می‌دهیم (هیچ مقدار پیش‌فرض سخت‌کد‌شده وجود ندارد).
 * - مقایسه با crypto.timingSafeEqual انجام می‌شود تا حمله timing ممکن نباشد.
 */

import { createHmac, timingSafeEqual } from "crypto";

/** خواندن کلید از محیط — بدون fallback! */
function getSecret(): string {
  const secret = process.env.CERTIFICATE_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "CERTIFICATE_SECRET در .env.local تعریف نشده است (حداقل ۱۶ کاراکتر).",
    );
  }
  return secret;
}

/** ساخت توکن HMAC برای یک UUID گواهینامه */
export function createCertificateToken(certificateUuid: string): string {
  return createHmac("sha256", getSecret()).update(certificateUuid).digest("hex");
}

/**
 * مقایسه امن توکن (constant-time).
 * true یعنی توکن درست است.
 */
export function verifyCertificateToken(
  certificateUuid: string,
  providedToken: string | null,
): boolean {
  if (!providedToken) return false;
  try {
    const expected = Buffer.from(createCertificateToken(certificateUuid), "hex");
    const provided = Buffer.from(providedToken, "hex");
    // اگر طول‌ها فرق کند timingSafeEqual خطا می‌دهد → توکن قطعاً نامعتبر است
    if (expected.length !== provided.length) return false;
    return timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}
