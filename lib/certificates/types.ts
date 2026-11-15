/**
 * نوع‌های سیستم گواهینامه.
 */

// وضعیت گواهینامه: فعال یا باطل‌شده
export type CertificateStatus = "active" | "revoked";

// یک ردیف از جدول certificates
export interface CertificateRow {
  id: string; // UUID تصادفی
  readableCode: string; // شماره خوانا مثل JJ-1404-000001
  studentId: string; // شناسه دانشجو
  courseId: string; // شناسه دوره
  studentName: string; // نام دانشجو (لحظه صدور)
  courseTitle: string; // عنوان دوره (لحظه صدور)
  issuedAt: string; // تاریخ صدور (ISO)
  status: CertificateStatus; // active یا revoked
  revokedAt: string | null; // تاریخ ابطال (در صورت ابطال)
  revokeReason: string | null; // دلیل ابطال
}

// یک ردیف از جدول certificate_scan_log — گزارش هر بار اسکن/بازدید
export interface ScanLogRow {
  id: string; // UUID
  certificateId: string; // شناسه گواهینامه
  scannedAt: string; // زمان اسکن (ISO)
  ip: string; // IP بازدیدکننده
  userAgent: string; // مرورگر/دستگاه
  result: "valid" | "revoked" | "not_found" | "invalid_token"; // نتیجه استعلام
}
