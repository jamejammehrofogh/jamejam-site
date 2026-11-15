/**
 * «دیتابیس» ساده در حافظه (in-memory) — جایگزین نسخه فایل‌محور.
 *
 * چرا حافظه؟ برای کامپایل و اجرا در Edge Runtime (Cloudflare Pages)
 * دسترسی به fs در دسترس نیست؛ فعلاً داده‌ها در یک متغیر سراسری نگه داشته می‌شوند.
 * بعداً می‌توانید همین فایل را به KV/D1 وصل کنید؛ بقیه برنامه تغییر نمی‌کند
 * چون همه از همین توابع استفاده می‌کنند.
 */

import type { Enrollment, StudentUser } from "./types";

/** ذخیره‌گاه در حافظه (global برای بقا بین هات‌ریلودها در dev) */
const globalStore = globalThis as unknown as {
  __usersStore?: StudentUser[];
  __enrollmentsStore?: Enrollment[];
};

const usersStore: StudentUser[] = (globalStore.__usersStore ??= []);
const enrollmentsStore: Enrollment[] = (globalStore.__enrollmentsStore ??= []);

/* ------------------------- کاربران ------------------------- */

export async function getUsers(): Promise<StudentUser[]> {
  return [...usersStore];
}

export async function saveUsers(users: StudentUser[]): Promise<void> {
  usersStore.length = 0;
  usersStore.push(...users);
}

/** پیدا کردن کاربر با شماره موبایل (شماره قبلش نرمال شده) */
export async function findUserByPhone(phone: string): Promise<StudentUser | undefined> {
  return usersStore.find((user) => user.phone === phone);
}

/** پیدا کردن کاربر با شناسه */
export async function findUserById(id: string): Promise<StudentUser | undefined> {
  return usersStore.find((user) => user.id === id);
}

/** اضافه کردن کاربر جدید */
export async function insertUser(user: StudentUser): Promise<void> {
  usersStore.push(user);
}

/* ------------------------- ثبت‌نام‌ها (enrollments) ------------------------- */

export async function getEnrollments(): Promise<Enrollment[]> {
  return [...enrollmentsStore];
}

/** ذخیره کل آرایه ثبت‌نام‌ها (برای بروزرسانی از طرف ادمین) */
export async function saveEnrollments(rows: Enrollment[]): Promise<void> {
  enrollmentsStore.length = 0;
  enrollmentsStore.push(...rows);
}

/** ثبت‌نام‌های یک دانشجو */
export async function getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
  return enrollmentsStore.filter((row) => row.studentId === studentId);
}

/** افزودن یک ثبت‌نام جدید */
export async function insertEnrollment(enrollment: Enrollment): Promise<void> {
  enrollmentsStore.push(enrollment);
}

/**
 * Seed: اگر هیچ ثبت‌نامی وجود ندارد، دو ثبت‌نام نمونه می‌سازد
 * تا داشبورد برای تست خالی نباشد.
 */
export async function seedSampleEnrollments(studentId: string): Promise<void> {
  if (enrollmentsStore.some((row) => row.studentId === studentId)) return; // قبلاً دارد؛ کاری نکن

  const now = new Date().toISOString();
  enrollmentsStore.push(
    {
      id: `enr_${Date.now().toString(36)}_1`,
      studentId,
      courseId: "basics",
      courseTitle: "مبانی آسانسور",
      progressPercent: 65,
      completed: false,
      enrolledAt: now,
    },
    {
      id: `enr_${Date.now().toString(36)}_2`,
      studentId,
      courseId: "maintenance",
      courseTitle: "سرویس و نگهداری دوره‌ای",
      progressPercent: 100,
      completed: true,
      enrolledAt: now,
    },
  );
}
