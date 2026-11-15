/**
 * «دیتابیس» ساده مبتنی بر فایل JSON — جایگزین آسان برای SQLite/Postgres در آینده.
 *
 * چرا فایل؟ پروژه هنوز دیتابیس واقعی ندارد و این روش ساده‌ترین راه برای شروع است.
 * اگر بعداً خواستید دیتابیس واقعی بگذارید، فقط همین فایل را عوض کنید؛
 * بقیه برنامه (routes و صفحات) تغییر نمی‌کند چون همه از همین توابع استفاده می‌کنند.
 */

import { promises as fs } from "fs";
import path from "path";

import type { Enrollment, StudentUser } from "./types";

// مسیر فایل داده‌ها: data/users.json و data/enrollments.json
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ENROLLMENTS_FILE = path.join(DATA_DIR, "enrollments.json");

/** خواندن آرایه از یک فایل JSON؛ اگر فایل نبود، آرایه خالی برمی‌گرداند */
async function readJsonArray<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return []; // فایل وجود ندارد → دیتای خالی
  }
}

/** نوشتن آرایه در فایل JSON با ساخت پوشه در صورت نیاز */
async function writeJsonArray<T>(filePath: string, rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf8");
}

/* ------------------------- کاربران ------------------------- */

export async function getUsers(): Promise<StudentUser[]> {
  return readJsonArray<StudentUser>(USERS_FILE);
}

export async function saveUsers(users: StudentUser[]): Promise<void> {
  await writeJsonArray(USERS_FILE, users);
}

/** پیدا کردن کاربر با شماره موبایل (شماره قبلش نرمال شده) */
export async function findUserByPhone(phone: string): Promise<StudentUser | undefined> {
  const users = await getUsers();
  return users.find((user) => user.phone === phone);
}

/** پیدا کردن کاربر با شناسه */
export async function findUserById(id: string): Promise<StudentUser | undefined> {
  const users = await getUsers();
  return users.find((user) => user.id === id);
}

/** اضافه کردن کاربر جدید */
export async function insertUser(user: StudentUser): Promise<void> {
  const users = await getUsers();
  users.push(user);
  await saveUsers(users);
}

/* ------------------------- ثبت‌نام‌ها (enrollments) ------------------------- */

export async function getEnrollments(): Promise<Enrollment[]> {
  return readJsonArray<Enrollment>(ENROLLMENTS_FILE);
}

/** ذخیره کل آرایه ثبت‌نام‌ها (برای بروزرسانی از طرف ادمین) */
export async function saveEnrollments(rows: Enrollment[]): Promise<void> {
  await writeJsonArray(ENROLLMENTS_FILE, rows);
}

/** ثبت‌نام‌های یک دانشجو */
export async function getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
  const all = await getEnrollments();
  return all.filter((row) => row.studentId === studentId);
}

/** افزودن یک ثبت‌نام جدید */
export async function insertEnrollment(enrollment: Enrollment): Promise<void> {
  const all = await getEnrollments();
  all.push(enrollment);
  await writeJsonArray(ENROLLMENTS_FILE, all);
}

/**
 * Seed: اگر هیچ ثبت‌نامی وجود ندارد، دو ثبت‌نام نمونه می‌سازد
 * تا داشبورد برای تست خالی نباشد.
 */
export async function seedSampleEnrollments(studentId: string): Promise<void> {
  const all = await getEnrollments();
  if (all.some((row) => row.studentId === studentId)) return; // قبلاً دارد؛ کاری نکن

  const now = new Date().toISOString();
  await writeJsonArray(ENROLLMENTS_FILE, [
    ...all,
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
  ] satisfies Enrollment[]);
}
