/**
 * API ورود: POST /api/auth/login
 * ورودی JSON: { phone, password }
 * خروجی: کوکی نشست + اطلاعات کاربر، یا پیام خطای فارسی
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { findUserByPhone } from "@/lib/auth/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { AUTH_ERRORS, normalizeDigits } from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; password?: string };
    const phone = normalizeDigits(body.phone ?? "");
    const password = body.password ?? "";

    if (!phone || !password) {
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.missingFields }, { status: 400 });
    }

    const user = await findUserByPhone(phone);
    if (!user) {
      // پیام عمداً کلی است تا نفهمند کدام فیلد غلط بود
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.wrongCredentials }, { status: 401 });
    }

    // مقایسه رمز واردشده با هش ذخیره‌شده
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.wrongCredentials }, { status: 401 });
    }

    const token = await createSessionToken({ sub: user.id, name: user.fullName, phone: user.phone });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, fullName: user.fullName, phone: user.phone },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "خطای غیرمنتظره در سرور. دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
