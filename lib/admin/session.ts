/**
 * نشست ادمین — کاملاً مستقل از نشست دانشجو.
 *
 * - کوکی جداگانه: jj_admin_session (نشست دانشجو jj_auth است و هرگز با هم قاطی نمی‌شوند)
 * - رمز عبور با bcrypt هش می‌شود و در data/admins.json ذخیره می‌شود.
 * - کلید امضای JWT هم جداگانه است: ADMIN_SECRET (از .env.local)
 *
 * چرا جدا؟ اگر کوکی دانشجو لو برود، ادمین امن می‌ماند و برعکس —
 * تفکیک سطح دسترسی از اصل‌های امنیتی است.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "jj_admin_session";
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 4; // نشست ادمین کوتاه‌تر: ۴ ساعت

// شکل payload نشست ادمین
export interface AdminSessionPayload {
  sub: string; // شناسه ادمین
  username: string; // نام کاربری
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) {
    // در dev بدون کلید هم کار نکنیم — کلید باید در env باشد
    throw new Error("ADMIN_SECRET در .env.local تعریف نشده است (حداقل ۱۶ کاراکتر).");
  }
  return new TextEncoder().encode(secret);
}

/** ساخت توکن JWT ادمین */
export async function createAdminToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/** خواندن و اعتبارسنجی نشست ادمین از کوکی (یا null) */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      username: typeof payload.username === "string" ? payload.username : "",
    };
  } catch {
    return null;
  }
}

/** ست کردن کوکی ادمین */
export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "strict", // برای ادمین سخت‌گیرانه‌تر: strict
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_MAX_AGE_SECONDS,
    path: "/",
  });
}

/** حذف کوکی ادمین */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
