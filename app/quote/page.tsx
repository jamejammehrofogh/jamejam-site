import type { Metadata } from "next";
import { ClipboardCheck, Phone } from "lucide-react";

import { QuoteWizard } from "@/components/quote/quote-wizard";

export const metadata: Metadata = {
  title: "درخواست مشاوره و برآورد",
  description: "مشخصات پروژه آسانسور را ثبت کنید تا کارشناسان جام جم با شما تماس بگیرند.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <div className="min-h-[70vh] bg-mist px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand">
            <ClipboardCheck size={15} /> مشاوره تخصصی جام جم
          </span>
          <h1 className="mt-5 text-3xl font-black leading-relaxed text-ink sm:text-4xl">برای پروژه آسانسورتان درخواست ثبت کنید</h1>
          <p className="mt-4 leading-8 text-slate-600">چند مشخصهٔ اولیه را وارد کنید تا تیم آقای خوزان متناسب با نیاز ساختمان شما راهنمایی‌تان کند.</p>
          <a href="tel:09126975580" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand"><Phone size={17} /> ۰۹۱۲ ۶۹۷ ۵۵۸۰</a>
        </div>
        <QuoteWizard initialService={service} />
      </div>
    </div>
  );
}
