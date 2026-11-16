/**
 * داده‌های ادمین — فایل admins.json با هش bcrypt.
 *
 * ادمین اولین بار به‌صورت خودکار ساخته می‌شود (bootstrap):
 * نام کاربری و رمز از متغیرهای محیطی ADMIN_USERNAME / ADMIN_PASSWORD
 * خوانده می‌شود و اگر در فایل نبود، ساخته و هش می‌شود.
 * رمز خام هرگز در هیچ فایل یا لاگی ذخیره نمی‌شود.
 */

// خروجی استاتیک: دسترسی به fs در خروجی استاتیک/کلاینت وجود ندارد؛
// این لایه به یک درون‌حافظه‌ای ساده تبدیل شده تا build پاس شود.
// بعداً دیتابیس واقعی (KV/D1) جایگزین می‌شود.
// import { promises as fs } from "fs";
// import path from "path";
import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string; // هش bcrypt
  createdAt: string;
}

/** ذخیره‌گاه موقت در حافظه */
const adminsStore: AdminUser[] = [];

async function readAdmins(): Promise<AdminUser[]> {
  return [...adminsStore];
}

async function writeAdmins(admins: AdminUser[]): Promise<void> {
  adminsStore.length = 0;
  adminsStore.push(...admins);
}

/** اطمینان از وجود حداقل یک ادمین (bootstrap از env) */
export async function ensureBootstrapAdmin(): Promise<void> {
  const admins = await readAdmins();
  if (admins.length > 0) return;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || password.length < 8) {
    // بدون ادمین، لاگین ادمین خطای واضح می‌دهد
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await writeAdmins([
    {
      id: `admin_${Date.now().toString(36)}`,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    },
  ]);
}

/** ورود ادمین: بررسی نام کاربری و رمز با bcrypt */
export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<AdminUser | null> {
  await ensureBootstrapAdmin();
  const admins = await readAdmins();
  const admin = admins.find((a) => a.username === username.trim());
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? admin : null;
}
