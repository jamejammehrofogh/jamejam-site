/**
 * مدیریت نشست (session) با JWT در کوکی httpOnly.
 *
 * - توکن با کتابخانه jose امضا می‌شود (HS256).
 * - کلید امضا از فایل .env.local می‌آید: AUTH_SECRET
 * - کوکی httpOnly است یعنی جاوااسکریپت مرورگر نمی‌تواند آن را بخواند
 *   → در برابر حملات XSS مقاوم‌تر است.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import type { SessionPayload } from "./types";

export const SESSION_COOKIE_NAME = "jj_auth"; // نام کوکی نشست

// عمر نشست: ۷ روز (بر حسب ثانیه)
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** کلید امضا را از متغیر محیطی می‌خواند؛ اگر نبود یک کلید موقت (فقط برای dev) می‌سازد */
function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "dev-only-secret-change-me-in-production";
  return new TextEncoder().encode(secret);
}

/** ساخت توکن JWT برای یک کاربر */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ name: payload.name, phone: payload.phone })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub) // شناسه کاربر
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`) // انقضای ۷ روزه
    .sign(getSecretKey());
}

/**
 * خواندن و اعتبارسنجی توکن از کوکی.
 * خروجی: اطلاعات نشست یا null (یعنی مهمان / لاگ‌آوت / توکن فاسد)
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      phone: typeof payload.phone === "string" ? payload.phone : "",
    };
  } catch {
    return null; // توکن نامعتبر یا منقضی
  }
}

/**
 * ست کردن کوکی نشست.
 * نکته: این تابع فقط داخل Route Handler / Server Action قابل استفاده است.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // جاوااسکریپت به آن دسترسی ندارد
    sameSite: "lax", // محافظت نسبی در برابر CSRF
    secure: process.env.NODE_ENV === "production", // در تولید فقط روی HTTPS
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/", // برای کل سایت معتبر است
  });
}

/** حذف کوکی نشست (خروج از حساب) */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
