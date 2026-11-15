/**
 * توکن امنیتی گواهینامه.
 *
 * token = HMAC-SHA256(certificateUUID, SECRET_KEY)
 *
 * - SECRET_KEY فقط از متغیر محیطی CERTIFICATE_SECRET خوانده می‌شود؛
 *   اگر تعریف نشده باشد خطا می‌دهیم (هیچ مقدار پیش‌فرض سخت‌کد‌شده وجود ندارد).
 * - مقایسه constant-time دستی انجام می‌شود تا حمله timing ممکن نباشد.
 *   (نسخه Web Crypto — سازگار با Edge Runtime)
 */

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

/** HMAC-SHA256 با Web Crypto (Edge-compatible) */
async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** ساخت توکن HMAC برای یک UUID گواهینامه */
export async function createCertificateToken(certificateUuid: string): Promise<string> {
  return hmacSha256Hex(certificateUuid, getSecret());
}

/**
 * مقایسه امن توکن (constant-time دستی روی رشته hex).
 * true یعنی توکن درست است.
 */
export async function verifyCertificateToken(
  certificateUuid: string,
  providedToken: string | null,
): Promise<boolean> {
  if (!providedToken) return false;
  try {
    const expected = await createCertificateToken(certificateUuid);
    // مقایسه constant-time: XOR روی همه کاراکترها حتی اگر طول فرق کند
    const maxLen = Math.max(expected.length, providedToken.length);
    let diff = expected.length ^ providedToken.length;
    for (let i = 0; i < maxLen; i++) {
      diff |= (expected.charCodeAt(i) || 0) ^ (providedToken.charCodeAt(i) || 0);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
