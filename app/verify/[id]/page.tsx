import { ShieldAlert } from "lucide-react";

export function generateStaticParams() {
  return [{ id: "test-id" }];
}

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark-bg px-4 py-10 text-ink">
      <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-amber-500/40 bg-[#101216] p-8 text-center shadow-lg">
        <ShieldAlert size={48} className="text-amber-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-black">در حال بررسی مدرک</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
          این صفحه صرفاً یک نمونه استاتیک برای تست بیلد است.
        </p>
      </div>
    </main>
  );
}