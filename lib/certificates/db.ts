/**
 * لایه داده گواهینامه‌ها — در حافظه (in-memory).
 *
 * چرا حافظه؟ برای Edge Runtime (Cloudflare Pages) دسترسی به fs در دسترس نیست.
 *
 * قید UNIQUE: «حداکثر یک گواهینامه برای هر (studentId, courseId)»
 * این قید اینجا به‌صورت منطقی اعمال می‌شود: قبل از صدور جست‌وجو می‌کنیم و
 * اگر رکوردی وجود داشته باشد همان رکورد قبلی برمی‌گردد (نه رکورد جدید).
 * وقتی بعداً دیتابیس واقعی (KV/D1/SQLite/Postgres) اضافه شود، همین قید با
 * UNIQUE(student_id, course_id) در سطح جدول تضمین می‌شود.
 */

import type { CertificateRow, ScanLogRow } from "./types";

/** ذخیره‌گاه در حافظه (global برای بقا بین هات‌ریلودها در dev) */
const globalStore = globalThis as unknown as {
  __certificatesStore?: CertificateRow[];
  __scanLogStore?: ScanLogRow[];
};

const certificatesStore: CertificateRow[] = (globalStore.__certificatesStore ??= []);
const scanLogStore: ScanLogRow[] = (globalStore.__scanLogStore ??= []);

/* ------------------------- گواهینامه‌ها ------------------------- */

export async function getCertificates(): Promise<CertificateRow[]> {
  return [...certificatesStore];
}

export async function saveCertificates(rows: CertificateRow[]): Promise<void> {
  certificatesStore.length = 0;
  certificatesStore.push(...rows);
}

/** گواهینامه یک دانشجو برای یک دوره خاص (یا undefined) */
export async function findCertificateByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<CertificateRow | undefined> {
  return certificatesStore.find((row) => row.studentId === studentId && row.courseId === courseId);
}

/** گواهینامه با UUID */
export async function findCertificateById(id: string): Promise<CertificateRow | undefined> {
  return certificatesStore.find((row) => row.id === id);
}

/** گواهینامه‌های یک دانشجو */
export async function getCertificatesByStudent(studentId: string): Promise<CertificateRow[]> {
  return certificatesStore.filter((row) => row.studentId === studentId);
}

/** افزودن گواهینامه جدید */
export async function insertCertificate(row: CertificateRow): Promise<void> {
  certificatesStore.push(row);
}

/* ------------------------- گزارش اسکن‌ها ------------------------- */

/** خواندن کامل گزارش اسکن‌ها (برای پنل ادمین) */
export async function readScanLog(): Promise<ScanLogRow[]> {
  return [...scanLogStore];
}

/** ثبت یک بار اسکن/بازدید صفحه استعلام */
export async function logScan(entry: Omit<ScanLogRow, "id">): Promise<void> {
  scanLogStore.push({
    ...entry,
    id: `scan_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
  });
}
