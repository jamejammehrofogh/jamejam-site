/**
 * API خروج از حساب: POST /api/auth/logout
 * کوکی نشست را حذف می‌کند و کاربر مهمان می‌شود.
 */

import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
