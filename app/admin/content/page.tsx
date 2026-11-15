import type { Metadata } from "next";
import { Save } from "lucide-react";

export const metadata: Metadata = { title: "محتوای سایت | پنل مدیریت" };

export default function AdminContentPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#14120f] p-5 sm:p-7">
      <h1 className="text-xl font-black text-amber-50">محتوای سایت</h1>
      <p className="mt-2 text-sm leading-7 text-stone-400">نمونهٔ فرم مدیریت محتوا؛ ذخیره‌سازی این بخش در نسخهٔ فعلی فعال نیست.</p>
      <form className="mt-6 space-y-5">
        <label className="block text-sm font-bold text-stone-300">عنوان اصلی صفحه
          <input defaultValue="حرکت رو به بالا، با اطمینان جام جم" className="mt-2 h-12 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" />
        </label>
        <label className="block text-sm font-bold text-stone-300">متن معرفی
          <textarea defaultValue="شرکت آسانسور جام جم، همراه مطمئن شما در طراحی، نصب و نگهداری آسانسور." rows={4} className="mt-2 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm leading-7 text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" />
        </label>
        <label className="block text-sm font-bold text-stone-300">شماره تماس
          <input defaultValue="09126975580" dir="ltr" className="mt-2 h-12 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-left text-sm text-white focus:border-[#d6b66c] focus:ring-[#d6b66c]" />
        </label>
        <button type="button" disabled title="ذخیره‌سازی پس از اتصال API فعال می‌شود" className="inline-flex items-center gap-2 rounded-xl bg-[#c3a258] px-5 py-3 text-sm font-bold text-[#17130b] opacity-60"><Save size={16} /> ذخیره تغییرات</button>
      </form>
    </section>
  );
}
