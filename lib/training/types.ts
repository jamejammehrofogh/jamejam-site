export type CourseCategory =
  | "technician"
  | "apprentice"
  | "safety"
  | "maintenance"
  | "modernization";

export type CourseStatus = "open" | "upcoming" | "closed";

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  durationHours: number;
  sessionsCount: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  instructor: string;
  location: string;
  capacity: number;
  tuition: number; // Toman
  status: CourseStatus;
  createdAt: string;
}

export type CertificateStatus = "valid" | "revoked";

export interface Certificate {
  id: string;
  serial: string; // e.g. JJ-CERT-1403-000123
  studentName: string;
  nationalId: string; // optional-friendly, plain string
  courseId: string;
  courseTitle: string;
  durationHours: number;
  issueDate: string; // ISO date
  completionDate: string; // ISO date
  grade: string;
  status: CertificateStatus;
  revokedAt: string | null;
  revokeReason: string | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: "created" | "updated" | "revoked" | "restored" | "bulk_created";
  certificateId: string | null;
  serial: string | null;
  detail: string;
  createdAt: string;
}

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  technician: "تکنسین آسانسور",
  apprentice: "کارآموزی",
  safety: "ایمنی و استاندارد",
  maintenance: "نگهداری و سرویس",
  modernization: "نوسازی",
};

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  open: "در حال ثبت‌نام",
  upcoming: "پیش‌رو",
  closed: "برگزارشده",
};

export function serializeDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
