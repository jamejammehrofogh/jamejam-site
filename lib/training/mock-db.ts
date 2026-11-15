import type {
  AuditLogEntry,
  Certificate,
  TrainingCourse,
} from "@/lib/training/types";

export type TrainingDatabase = {
  courses: TrainingCourse[];
  certificates: Certificate[];
  auditLog: AuditLogEntry[];
};

const globalForTraining = globalThis as typeof globalThis & {
  jamJamTrainingDatabase?: TrainingDatabase;
};

const DAY = 24 * 60 * 60 * 1000;
const iso = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * DAY).toISOString();

function course(
  id: string,
  title: string,
  description: string,
  category: TrainingCourse["category"],
  durationHours: number,
  sessionsCount: number,
  startOffset: number,
  lengthDays: number,
  instructor: string,
  capacity: number,
  tuition: number,
  status: TrainingCourse["status"],
): TrainingCourse {
  return {
    id,
    title,
    description,
    category,
    durationHours,
    sessionsCount,
    startDate: iso(startOffset),
    endDate: iso(startOffset + lengthDays),
    instructor,
    location: "سایت مرکزی جام جم — سالن آموزش، تهران",
    capacity,
    tuition,
    status,
    createdAt: iso(startOffset - 30),
  };
}

const seedCourses: TrainingCourse[] = [
  course(
    "course-101",
    "دوره جامع تکنسین نصب آسانسور",
    "آموزش عملی نصب و راه‌اندازی آسانسورهای کششی و هیدرولیکی مطابق استاندارد ملی ایران.",
    "technician",
    120,
    15,
    10,
    45,
    "مهندس خوزان",
    20,
    8_500_000,
    "open",
  ),
  course(
    "course-102",
    "کارآموزی ایمنی و استاندارد آسانسور",
    "آشنایی با استاندارد ۱-۶۳۰۴ ملی، روش‌های قفل‌گذاری، تست ایمنی و الزامات بازرسی.",
    "safety",
    32,
    8,
    3,
    14,
    "مهندس رستمی",
    25,
    3_200_000,
    "open",
  ),
  course(
    "course-103",
    "نگهداری و سرویس دوره‌ای آسانسور",
    "چک‌لیست سرویس ماهانه، عیب‌یابی درگاه و فرمان، تنظیم درب‌ها و روانکاری.",
    "maintenance",
    48,
    12,
    -20,
    30,
    "مهندس کاظمی",
    18,
    4_800_000,
    "closed",
  ),
  course(
    "course-104",
    "نوسازی و به‌روزرسانی آسانسورهای قدیمی",
    "جایگزینی فرمان رله‌ای با میکروپروسسوری، تبدیل DC به ACVVVF و ارتقای ایمنی.",
    "modernization",
    60,
    10,
    35,
    21,
    "مهندس خوزان",
    15,
    6_400_000,
    "upcoming",
  ),
];

function certificate(
  id: string,
  serial: string,
  studentName: string,
  nationalId: string,
  course: TrainingCourse,
  grade: string,
  issueOffset: number,
): Certificate {
  return {
    id,
    serial,
    studentName,
    nationalId,
    courseId: course.id,
    courseTitle: course.title,
    durationHours: course.durationHours,
    issueDate: iso(issueOffset),
    completionDate: course.endDate,
    grade,
    status: "valid",
    revokedAt: null,
    revokeReason: null,
    createdAt: iso(issueOffset),
  };
}

const seedCertificates: Certificate[] = [
  certificate(
    "cert-1001",
    "JJ-CERT-1404-000101",
    "علی محمدی",
    "0012345678",
    seedCourses[2],
    "ممتاز",
    -5,
  ),
  certificate(
    "cert-1002",
    "JJ-CERT-1404-000102",
    "رضا کریمی",
    "0098765432",
    seedCourses[2],
    "خیلی خوب",
    -4,
  ),
  certificate(
    "cert-1003",
    "JJ-CERT-1404-000103",
    "حسین احمدی",
    "0055512345",
    seedCourses[2],
    "خوب",
    -4,
  ),
];

seedCertificates[2] = {
  ...seedCertificates[2],
  status: "revoked",
  revokedAt: iso(-1),
  revokeReason: "عدم تطابق مشخصات با مدارک ارائه‌شده — ابطال به درخواست واحد آموزش.",
};

export const trainingDatabase =
  globalForTraining.jamJamTrainingDatabase ??
  (globalForTraining.jamJamTrainingDatabase = {
    courses: seedCourses,
    certificates: seedCertificates,
    auditLog: seedCertificates.map((certificate, index) => ({
      id: `log-seed-${index}`,
      action: "created" as const,
      certificateId: certificate.id,
      serial: certificate.serial,
      detail: `صدور گواهینامه برای ${certificate.studentName} — دوره ${certificate.courseTitle}`,
      createdAt: certificate.createdAt,
    })),
  });

export function createTrainingId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateSerial(): string {
  // Jalali year of "today" via Intl (fa-IR calendar is the Persian calendar)
  const jalaliYear = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
  })
    .format(new Date())
    .replace(/\D/g, "");
  const year = jalaliYear.slice(-4);
  // Find the highest existing sequence for this year to guarantee uniqueness.
  const prefix = `JJ-CERT-${year}-`;
  const maxSeq = trainingDatabase.certificates.reduce((max, c) => {
    if (!c.serial.startsWith(prefix)) return max;
    const seq = Number.parseInt(c.serial.slice(prefix.length), 10);
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  const seq = String(maxSeq + 1).padStart(5, "0");
  return `${prefix}${seq}`;
}

export function logAudit(entry: Omit<AuditLogEntry, "id" | "createdAt">) {
  trainingDatabase.auditLog.unshift({
    ...entry,
    id: createTrainingId("log"),
    createdAt: new Date().toISOString(),
  });
}
