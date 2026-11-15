/**
 * لایه داده گواهینامه‌ها — همچنان فایل JSON (همان رویکرد گام ۳).
 *
 * قید UNIQUE: «حداکثر یک گواهینامه برای هر (studentId, courseId)»
 * این قید اینجا به‌صورت منطقی اعمال می‌شود: قبل از صدور جست‌وجو می‌کنیم و
 * اگر رکوردی وجود داشته باشد همان رکورد قبلی برمی‌گردد (نه رکورد جدید).
 * وقتی بعداً دیتابیس واقعی (SQLite/Postgres) اضافه شود، همین قید با
 * UNIQUE(student_id, course_id) در سطح جدول تضمین می‌شود.
 */

import { promises as fs } from "fs";
import path from "path";

import type { CertificateRow, ScanLogRow } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CERTIFICATES_FILE = path.join(DATA_DIR, "certificates.json");
const SCAN_LOG_FILE = path.join(DATA_DIR, "certificate_scan_log.json");

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJsonArray<T>(filePath: string, rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf8");
}

/* ------------------------- گواهینامه‌ها ------------------------- */

export async function getCertificates(): Promise<CertificateRow[]> {
  return readJsonArray<CertificateRow>(CERTIFICATES_FILE);
}

export async function saveCertificates(rows: CertificateRow[]): Promise<void> {
  await writeJsonArray(CERTIFICATES_FILE, rows);
}

/** گواهینامه یک دانشجو برای یک دوره خاص (یا undefined) */
export async function findCertificateByStudentAndCourse(
  studentId: string,
  courseId: string,
): Promise<CertificateRow | undefined> {
  const rows = await getCertificates();
  return rows.find((row) => row.studentId === studentId && row.courseId === courseId);
}

/** گواهینامه با UUID */
export async function findCertificateById(id: string): Promise<CertificateRow | undefined> {
  const rows = await getCertificates();
  return rows.find((row) => row.id === id);
}

/** گواهینامه‌های یک دانشجو */
export async function getCertificatesByStudent(studentId: string): Promise<CertificateRow[]> {
  const rows = await getCertificates();
  return rows.filter((row) => row.studentId === studentId);
}

/** افزودن گواهینامه جدید */
export async function insertCertificate(row: CertificateRow): Promise<void> {
  const rows = await getCertificates();
  rows.push(row);
  await saveCertificates(rows);
}

/* ------------------------- گزارش اسکن‌ها ------------------------- */

/** خواندن کامل گزارش اسکن‌ها (برای پنل ادمین) */
export async function readScanLog(): Promise<ScanLogRow[]> {
  return readJsonArray<ScanLogRow>(SCAN_LOG_FILE);
}

/** ثبت یک بار اسکن/بازدید صفحه استعلام */
export async function logScan(entry: Omit<ScanLogRow, "id">): Promise<void> {
  const rows = await readJsonArray<ScanLogRow>(SCAN_LOG_FILE);
  rows.push({
    ...entry,
    id: `scan_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
  });
  await writeJsonArray(SCAN_LOG_FILE, rows);
}
