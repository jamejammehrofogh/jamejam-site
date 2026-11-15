/**
 * اعتبارسنجی ورودی‌های ثبت‌نام و ورود + پیام‌های خطای فارسی.
 * این توابع هم در سمت سرور (API) و هم در فرم‌ها استفاده می‌شوند.
 */

/** تبدیل ارقام فارسی/عربی به لاتین و حذف فاصله‌ها و خط تیره */
export function normalizeDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\s-()+]/g, "");
}

/** بررسی فرمت شماره موبایل ایرانی: 11 رقم و شروع با 09 */
export function isValidIranianMobile(raw: string): boolean {
  const phone = normalizeDigits(raw);
  return /^09\d{9}$/.test(phone);
}

/**
 * بررسی قدرت رمز عبور:
 * حداقل ۸ کاراکتر + حداقل یک حرف + حداقل یک رقم
 */
export function getPasswordError(password: string): string | null {
  if (password.length < 8) {
    return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
  }
  if (!/[a-zA-Zآ-ی]/.test(password)) {
    return "رمز عبور باید حداقل یک حرف داشته باشد.";
  }
  if (!/\d/.test(password)) {
    return "رمز عبور باید حداقل یک رقم داشته باشد.";
  }
  return null; // رمز مشکلی ندارد
}

/** بررسی نام: حداقل ۳ کاراکتر */
export function getFullNameError(fullName: string): string | null {
  if (fullName.trim().length < 3) {
    return "لطفاً نام و نام خانوادگی را کامل وارد کنید (حداقل ۳ حرف).";
  }
  return null;
}

/** پیام‌های خطای آماده برای API */
export const AUTH_ERRORS = {
  invalidPhone: "شماره موبایل معتبر نیست. مثال صحیح: 09123456789",
  weakPassword: "رمز عبور ضعیف است.",
  duplicatePhone: "این شماره موبایل قبلاً ثبت شده است. وارد شوید یا شماره دیگری بزنید.",
  wrongCredentials: "شماره موبایل یا رمز عبور اشتباه است.",
  missingFields: "لطفاً همه فیلدها را پر کنید.",
} as const;
