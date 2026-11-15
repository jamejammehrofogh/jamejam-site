/**
 * میدل‌ور احراز هویت — Next.js این فایل را قبل از هر درخواست اجرا می‌کند.
 *
 * کارش ساده است:
 *  - اگر کاربر به صفحات /panel/* می‌رود ولی لاگ‌ین نیست → هدایت به /login
 *  - اگر کاربر لاگ‌ین است و به /login می‌رود → هدایت به /panel
 *  - مسیرهای /admin/training/* فقط با نشست ادمین (کوکی جداگانه) باز می‌شوند
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "jj_auth"; // دانشجو
const ADMIN_COOKIE_NAME = "jj_admin_session"; // ادمین (جدا از دانشجو!)

/** کلید امضای دانشجو — باید با lib/auth/session.ts یکی باشد */
function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "dev-only-secret-change-me-in-production";
  return new TextEncoder().encode(secret);
}

/** کلید امضای ادمین — باید با lib/admin/session.ts یکی باشد */
function getAdminSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SECRET ?? "dev-only-admin-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // آیا توکن معتبر است؟
  let isLoggedIn = false;
  if (token) {
    try {
      await jwtVerify(token, getSecretKey());
      isLoggedIn = true;
    } catch {
      isLoggedIn = false; // توکن فاسد یا منقضی
    }
  }

  // مسیرهای خصوصی: /panel و زیرمسیرهای آن
  const isPanelRoute = pathname === "/panel" || pathname.startsWith("/panel/");
  // صفحه ورود
  const isLoginPage = pathname === "/login";

  if (isPanelRoute && !isLoggedIn) {
    // مهمان → به صفحه ورود برود؛ بعد از ورود به همان صفحه برگردد
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && isLoggedIn) {
    // کاربر لاگ‌ین دیگر نیازی به صفحه ورود ندارد
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  // ---- محافظت از مسیرهای ادمین (بخش آموزش) ----
  // /admin/login آزاد است؛ بقیه /admin/training/* فقط با نشست ادمین
  const isAdminTraining = pathname.startsWith("/admin/training");
  if (isAdminTraining) {
    let adminLoggedIn = false;
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (adminToken) {
      try {
        await jwtVerify(adminToken, getAdminSecretKey());
        adminLoggedIn = true;
      } catch {
        adminLoggedIn = false;
      }
    }
    if (!adminLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// این میدل‌ور فقط برای این مسیرها اجرا شود (کارایی بهتر)
export const config = {
  matcher: ["/panel/:path*", "/login", "/admin/training/:path*"],
};
