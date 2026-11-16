/**
 * API ورود ادمین: POST /api/admin/login
 * ورودی: { username, password }
 * با bcrypt مقایسه می‌شود و کوکی جداگانه ادمین ست می‌شود.
 * هیچ اطلاع محرمانه‌ای در پاسخ یا لاگ نمی‌آید.
 */

import { NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/admin/db";
import { createAdminToken, setAdminCookie } from "@/lib/admin/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "لطفاً نام کاربری و رمز عبور را وارد کنید." },
        { status: 400 },
      );
    }

    const admin = await authenticateAdmin(username, password);
    if (!admin) {
      // پیام کلی — نمی‌گوییم کدام فیلد غلط بود
      return NextResponse.json(
        { ok: false, message: "نام کاربری یا رمز عبور اشتباه است." },
        { status: 401 },
      );
    }

    const token = await createAdminToken({ sub: admin.id, username: admin.username });
    await setAdminCookie(token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "خطای غیرمنتظره در سرور. دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
