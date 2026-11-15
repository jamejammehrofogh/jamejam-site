/**
 * API ثبت‌نام: POST /api/auth/register
 * ورودی JSON: { fullName, phone, password }
 * خروجی: کوکی نشست + اطلاعات کاربر، یا پیام خطای فارسی
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { findUserByPhone, insertUser } from "@/lib/auth/db";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import {
  AUTH_ERRORS,
  getFullNameError,
  getPasswordError,
  isValidIranianMobile,
  normalizeDigits,
} from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      phone?: string;
      password?: string;
    };

    const fullName = (body.fullName ?? "").trim();
    const phone = normalizeDigits(body.phone ?? "");
    const password = body.password ?? "";

    // ---- اعتبارسنجی ----
    if (!fullName || !phone || !password) {
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.missingFields }, { status: 400 });
    }
    const nameError = getFullNameError(fullName);
    if (nameError) {
      return NextResponse.json({ ok: false, message: nameError }, { status: 400 });
    }
    if (!isValidIranianMobile(phone)) {
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.invalidPhone }, { status: 400 });
    }
    const passwordError = getPasswordError(password);
    if (passwordError) {
      return NextResponse.json({ ok: false, message: passwordError }, { status: 400 });
    }

    // ---- چک تکراری بودن شماره ----
    const existing = await findUserByPhone(phone);
    if (existing) {
      return NextResponse.json({ ok: false, message: AUTH_ERRORS.duplicatePhone }, { status: 409 });
    }

    // ---- هش کردن رمز عبور با bcrypt (هرگز رمز خام ذخیره نمی‌شود) ----
    const passwordHash = await bcrypt.hash(password, 10); // 10 = تعداد دورهای salt

    const user = {
      id: `user_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      fullName,
      phone,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    await insertUser(user);

    // ---- ساخت نشست و ست کوکی ----
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
