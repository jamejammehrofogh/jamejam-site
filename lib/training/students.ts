import { trainingDatabase } from "@/lib/training/mock-db";
import type { Certificate, TrainingCourse } from "@/lib/training/types";

/* ------------------------------------------------------------------ */
/* Student records (mock auth directory)                               */
/* ------------------------------------------------------------------ */

export interface StudentRecord {
  id: string;
  fullName: string;
  nationalId: string; // 10 latin digits
  phone: string; // 11 latin digits, e.g. 09126975580
  status: "active" | "suspended" | "graduated";
  enrolledCourseIds: string[];
  /** Course completion percent, keyed by courseId. */
  progress: Record<string, number>;
}

export interface StudentSession {
  student: Omit<StudentRecord, "enrolledCourseIds">;
  courses: TrainingCourse[];
  certificates: Certificate[];
}

const STUDENTS: StudentRecord[] = [
  {
    id: "student-1",
    fullName: "علی محمدی",
    nationalId: "0012345678",
    phone: "09126975580",
    status: "graduated",
    enrolledCourseIds: ["course-103"],
    progress: { "course-103": 100 },
  },
  {
    id: "student-2",
    fullName: "رضا کریمی",
    nationalId: "0098765432",
    phone: "09351234567",
    status: "active",
    enrolledCourseIds: ["course-101", "course-102"],
    progress: { "course-101": 65, "course-102": 30 },
  },
  {
    id: "student-3",
    fullName: "حسین احمدی",
    nationalId: "0055512345",
    phone: "09190001122",
    status: "suspended",
    enrolledCourseIds: ["course-101"],
    progress: { "course-101": 12 },
  },
];

/** Normalizes Persian/Arabic digits and strips separators. */
export function normalizeIdentifier(raw: string): string {
  return raw
    .replace(/[۰-۹٠-٩]/g, (d) => {
      const code = d.charCodeAt(0);
      return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
    })
    .replace(/[\s-()+]/g, "");
}

export function findStudentByIdentifier(
  rawIdentifier: string,
): StudentRecord | undefined {
  const identifier = normalizeIdentifier(rawIdentifier);
  return STUDENTS.find(
    (student) => student.phone === identifier || student.nationalId === identifier,
  );
}

export function getStudentSession(
  student: StudentRecord,
): StudentSession {
  const profile: Omit<StudentRecord, "enrolledCourseIds"> = {
    id: student.id,
    fullName: student.fullName,
    nationalId: student.nationalId,
    phone: student.phone,
    status: student.status,
    progress: student.progress,
  };
  const courses = trainingDatabase.courses.filter((course) =>
    student.enrolledCourseIds.includes(course.id),
  );
  const certificates = trainingDatabase.certificates.filter(
    (certificate) =>
      certificate.studentName === student.fullName ||
      certificate.nationalId === student.nationalId,
  );
  return { student: profile, courses, certificates };
}

/* ------------------------------------------------------------------ */
/* Mock token sessions (in-memory, keyed by opaque token)              */
/* ------------------------------------------------------------------ */

const globalForSessions = globalThis as typeof globalThis & {
  jamJamStudentSessions?: Map<string, string>; // token -> studentId
};

const sessions =
  globalForSessions.jamJamStudentSessions ??
  (globalForSessions.jamJamStudentSessions = new Map<string, string>());

export const SESSION_COOKIE = "jj_student_session";

export function createSession(studentId: string): string {
  const token = `${studentId}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
  sessions.set(token, studentId);
  return token;
}

export function resolveSession(token: string | undefined): StudentRecord | null {
  if (!token) return null;
  const studentId = sessions.get(token);
  if (!studentId) return null;
  return STUDENTS.find((student) => student.id === studentId) ?? null;
}

export function destroySession(token: string | undefined) {
  if (token) sessions.delete(token);
}
