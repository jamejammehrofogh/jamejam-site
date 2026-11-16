/**
 * API ثبت‌نام در دوره: POST /api/enroll
 * ورودی JSON: { courseId, courseTitle }
 * فقط برای کاربر لاگ‌ین‌شده. اگر مهمان باشد 401 برمی‌گرداند.
 */

import { NextResponse } from "next/server";

import { getEnrollments, insertEnrollment } from "@/lib/auth/db";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "برای ثبت‌نام ابتدا وارد حساب شوید." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as { courseId?: string; courseTitle?: string };
    if (!body.courseId) {
      return NextResponse.json({ ok: false, message: "دوره انتخاب نشده است." }, { status: 400 });
    }

    const enrollments = await getEnrollments();
    // اگر قبلاً در همین دوره ثبت‌نام کرده، دوباره نساز
    const already = enrollments.find(
      (row) => row.studentId === session.sub && row.courseId === body.courseId,
    );
    if (already) {
      return NextResponse.json({ ok: true, message: "شما قبلاً در این دوره ثبت‌نام کرده‌اید." });
    }

    await insertEnrollment({
      id: `enr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      studentId: session.sub,
      courseId: body.courseId,
      courseTitle: body.courseTitle ?? body.courseId,
      progressPercent: 0,
      completed: false,
      enrolledAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "ثبت‌نام انجام شد! به پنل خود بروید." });
  } catch {
    return NextResponse.json(
      { ok: false, message: "خطای غیرمنتظره در سرور. دوباره تلاش کنید." },
      { status: 500 },
    );
  }
}
