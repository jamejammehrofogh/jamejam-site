"use server";

/**
 * Server Action های ادمین — همه CSRF-امن هستند چون:
 *  ۱) Server Action های Next.js فقط از طریق فرم خود همان سایت قابل فراخوانی‌اند
 *     (POST با content-type خاص Next و امضای action id).
 *  ۲) هر action اول نشست ادمین را چک می‌کند و اگر نبود خطای «دسترسی ندارد» می‌دهد.
 *  ۳) ورودی‌ها با revalidate و اعتبارسنجی ساده چک می‌شوند.
 *
 * هیچ مقدار محرمانه (رمز/کلید) در پیام‌ها یا لاگ‌ها نمایش داده نمی‌شود.
 */

import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

import { getAdminSession } from "@/lib/admin/session";
import { getEnrollments, saveEnrollments } from "@/lib/auth/db";
import { issueCertificate } from "@/lib/certificates/issue";
import type { CertificateRow } from "@/lib/certificates/types";
import {
  getCertificates,
  saveCertificates,
} from "@/lib/certificates/db";

/** چک سریع دسترسی — اگر ادمین نبود خطا بده */
async function requireAdmin(): Promise<void> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("دسترسی مجاز نیست. لطفاً به‌عنوان ادمین وارد شوید.");
  }
}

/* ---------------------------------------------------------------
  اکشن ۱: تکمیل‌شده علامت‌زدن ثبت‌نام → صدور گواهینامه (بدون تکرار)
  --------------------------------------------------------------- */
export async function completeEnrollmentAction(formData: FormData) {
  await requireAdmin();

  const enrollmentId = String(formData.get("enrollmentId") ?? "").trim();
  if (!/^[a-zA-Z0-9_\-]{5,60}$/.test(enrollmentId)) {
    throw new Error("شناسه ثبت‌نام نامعتبر است.");
  }

  // ۱) پیدا کردن رکورد ثبت‌نام
  const enrollments = await getEnrollments();
  const enrollment = enrollments.find((row) => row.id === enrollmentId);
  if (!enrollment) {
    throw new Error("ثبت‌نام یافت نشد.");
  }

  // ۲) علامت‌زدن به‌عنوان تکمیل‌شده
  if (!enrollment.completed) {
    enrollment.completed = true;
    enrollment.progressPercent = 100;
    await saveEnrollments(enrollments);
  }

  // ۳) صدور گواهینامه از طریق تابع گام ۴ — خودش تضمین می‌کند تکراری نسازد
  const { isNew } = await issueCertificate({
    studentId: enrollment.studentId,
    courseId: enrollment.courseId,
    studentName: await getStudentNameById(enrollment.studentId),
    courseTitle: enrollment.courseTitle,
  });
  void isNew; // استفاده نشده ولی برای وضوح نگه داشته شده

  revalidatePath("/admin");
  revalidatePath("/panel");
}

/** نام دانشجو از فایل users.json — جدا برای وضوح */
async function getStudentNameById(studentId: string): Promise<string> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "users.json"), "utf8");
    const users = JSON.parse(raw) as Array<{ id: string; fullName: string }>;
    return users.find((u) => u.id === studentId)?.fullName ?? "دانشجو";
  } catch {
    return "دانشجو";
  }
}

/* ---------------------------------------------------------------
  اکشن ۲: ابطال گواهینامه
  بعد از ابطال، /verify/<id>?t=<token> باید بلافاصله پیام ابطال بدهد
  (HMAC همچنان درست است چون توکن به UUID بستگی دارد نه وضعیت).
  --------------------------------------------------------------- */
export async function revokeCertificateAction(formData: FormData) {
  await requireAdmin();

  const certificateId = String(formData.get("certificateId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || "ابطال به درخواست واحد آموزش.";

  // اعتبارسنجی UUID ساده
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(certificateId)) {
    throw new Error("شناسه گواهینامه نامعتبر است.");
  }
  if (reason.length > 300) {
    throw new Error("دلیل ابطال نباید بیش از ۳۰۰ کاراکتر باشد.");
  }

  const certificates = await getCertificates();
  const certificate = certificates.find((row) => row.id === certificateId);
  if (!certificate) {
    throw new Error("گواهینامه یافت نشد.");
  }

  const updated: CertificateRow = {
    ...certificate,
    status: "revoked",
    revokedAt: new Date().toISOString(),
    revokeReason: reason,
  };

  await saveCertificates(
    certificates.map((row) => (row.id === certificateId ? updated : row)),
  );

  revalidatePath("/admin");
  revalidatePath("/panel");
  revalidatePath(`/verify/${certificateId}`);
}

/* ---------------------------------------------------------------
  اکشن ۳: خروج ادمین
  --------------------------------------------------------------- */
export async function adminLogoutAction() {
  const { clearAdminCookie } = await import("@/lib/admin/session");
  await clearAdminCookie();
  revalidatePath("/admin/login");
}
