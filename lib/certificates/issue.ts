/**
 * صدور گواهینامه — تابع سمت سرور.
 *
 * قاعده طلایی: برای هر جفت (studentId, courseId) دقیقاً یک گواهینامه.
 * اگر قبلاً صادر شده، همان رکورد قبلی برمی‌گردد (idempotent).
 */

import { randomUUID } from "crypto";

import type { CertificateRow } from "./types";
import {
  findCertificateByStudentAndCourse,
  insertCertificate,
} from "./db";

/**
 * ساخت شماره خوانا در قالب JJ-YYYY-NNNNNN
 * YYYY بر اساس تقویم جلالی (سال شمسی جاری) و NNNNNN شمارنده افزایشی.
 */
async function generateReadableCode(): Promise<string> {
  // سال جلالی جاری با Intl
  const jalaliYear = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
  })
    .format(new Date())
    .replace(/\D/g, "")
    .slice(-4);

  const rows = await getCertificates();
  const prefix = `JJ-${jalaliYear}-`;
  // بزرگ‌ترین شماره فعلی این سال + ۱
  const maxSeq = rows.reduce((max, row) => {
    if (!row.readableCode.startsWith(prefix)) return max;
    const seq = Number.parseInt(row.readableCode.slice(prefix.length), 10);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(6, "0")}`;
}

// ایمپورت با تاخیر برای جلوگیری از چرخه وابستگی
import { getCertificates } from "./db";

export interface IssueCertificateInput {
  studentId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
}

/**
 * صدور (یا بازیابی) گواهینامه یک دانشجو برای یک دوره.
 * تضمین UNIQUE: اگر موجود باشد، همان برمی‌گردد.
 */
export async function issueCertificate(
  input: IssueCertificateInput,
): Promise<{ certificate: CertificateRow; isNew: boolean }> {
  // ۱) قید UNIQUE: آیا قبلاً صادر شده؟
  const existing = await findCertificateByStudentAndCourse(input.studentId, input.courseId);
  if (existing) {
    return { certificate: existing, isNew: false };
  }

  // ۲) ساخت رکورد جدید
  const certificate: CertificateRow = {
    id: randomUUID(), // UUID استاندارد v4
    readableCode: await generateReadableCode(),
    studentId: input.studentId,
    courseId: input.courseId,
    studentName: input.studentName,
    courseTitle: input.courseTitle,
    issuedAt: new Date().toISOString(),
    status: "active", // وضعیت اولیه همیشه active
    revokedAt: null,
    revokeReason: null,
  };

  await insertCertificate(certificate);
  return { certificate, isNew: true };
}
