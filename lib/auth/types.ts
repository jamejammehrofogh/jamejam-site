/**
 * نوع‌های مشترک احراز هویت (authentication)
 * این فایل فقط «شکل داده‌ها» را تعریف می‌کند.
 */

// یک دانشجو / کاربر در دیتابیس
export interface StudentUser {
  id: string; // شناسه یکتا مثل user_1712345
  fullName: string; // نام و نام خانوادگی
  phone: string; // شماره موبایل — همیشه نرمال‌شده، مثل 09123456789
  passwordHash: string; // هش bcrypt رمز عبور (هرگز رمز خام ذخیره نمی‌شود!)
  createdAt: string; // تاریخ ساخت حساب (ISO)
}

// چیزی که داخل کوکی JWT می‌گذاریم (payload توکن)
export interface SessionPayload {
  sub: string; // شناسه کاربر
  name: string; // نام کاربر (برای نمایش سریع در داشبورد)
  phone: string;
}

// اطلاعات کاربر که به صفحات داده می‌شود (بدون رمز)
export type PublicStudent = Pick<StudentUser, "id" | "fullName" | "phone" | "createdAt">;

// یک ردیف جدول ثبت‌نام‌ها (enrollments)
export interface Enrollment {
  id: string; // شناسه یکتا
  studentId: string; // شناسه کاربر
  courseId: string; // شناسه دوره
  courseTitle: string; // عنوان دوره (برای نمایش سریع)
  progressPercent: number; // درصد پیشرفت ۰ تا ۱۰۰
  completed: boolean; // آیا دوره تمام شده؟
  enrolledAt: string; // تاریخ ثبت‌نام (ISO)
}

// خطای اعتبارسنجی که API برمی‌گرداند
export interface ApiErrorResponse {
  ok: false;
  message: string; // پیام فارسی برای نمایش به کاربر
}
