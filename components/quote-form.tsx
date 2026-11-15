"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { saveQuoteRequest, toLatinDigits } from "@/data/mockData";

const quoteSchema = z.object({
  name: z.string().trim().min(2, "نام را کامل وارد کنید."),
  phone: z
    .string()
    .trim()
    .transform(toLatinDigits)
    .pipe(z.string().regex(/^0912\d{7}$/, "شماره همراه باید با ۰۹۱۲ شروع شود و ۱۱ رقم باشد.")),
  service: z.enum(["installation", "maintenance", "repair", "parts"], { error: "لطفاً نوع خدمت را انتخاب کنید." }),
  buildingType: z.enum(["residential", "commercial", "industrial"], { error: "نوع ساختمان را انتخاب کنید." }),
  stops: z.number().int().min(1, "تعداد طبقات را وارد کنید.").max(100, "تعداد طبقات معتبر نیست."),
  details: z.string().trim().max(500, "توضیحات حداکثر ۵۰۰ کاراکتر باشد.").optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", phone: "", details: "", stops: 6 },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      saveQuoteRequest(values);
      setSubmitted(true);
      toast.success("درخواست مشاوره شما با موفقیت ثبت شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت درخواست انجام نشد.");
    }
  };

  return (
    <section id="quote" className="bg-mist py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8">
        <div>
          <span className="text-sm font-bold text-brand">مشاوره و برآورد اولیه</span>
          <h2 className="mt-3 text-3xl font-black leading-relaxed text-ink sm:text-4xl">
            برای پروژه‌تان از کجا شروع کنیم؟
          </h2>
          <p className="mt-4 leading-8 text-slate-600">
            اطلاعات تماس و نیازتان را ثبت کنید تا برای بررسی اولیه و هماهنگی مشاوره با شما در ارتباط باشیم.
          </p>
          <p className="mt-5 text-sm text-slate-500">
            ترجیح می‌دهید مستقیم صحبت کنید؟{" "}
            <a href="tel:09126975580" className="font-bold text-brand hover:underline">
              ۰۹۱۲ ۶۹۷ ۵۵۸۰
            </a>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-3xl bg-white p-5 shadow-card sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              نام و نام خانوادگی
              <input
                {...register("name")}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "quote-name-error" : undefined}
                className="mt-2 h-12 w-full rounded-xl border-slate-200 text-sm placeholder:text-slate-400 focus:border-brand focus:ring-brand"
                placeholder="مثلاً علی رضایی"
              />
              {errors.name && <span id="quote-name-error" className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              شماره همراه
              <input
                {...register("phone")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                dir="ltr"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "quote-phone-error" : undefined}
                className="mt-2 h-12 w-full rounded-xl border-slate-200 text-left text-sm placeholder:text-right placeholder:text-slate-400 focus:border-brand focus:ring-brand"
                placeholder="09123456789"
              />
              {errors.phone && <span id="quote-phone-error" className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
            </label>
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              خدمت موردنیاز
              <select
                {...register("service")}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? "quote-service-error" : undefined}
                className="mt-2 h-12 w-full rounded-xl border-slate-200 text-sm text-slate-600 focus:border-brand focus:ring-brand"
              >
                <option value="">انتخاب کنید</option>
                <option value="installation">طراحی و نصب آسانسور</option>
                <option value="repair">تعمیرات تخصصی</option>
                <option value="maintenance">سرویس و نگهداری</option>
                <option value="parts">تأمین قطعات</option>
              </select>
              {errors.service && <span id="quote-service-error" className="mt-1 block text-xs text-red-600">{errors.service.message}</span>}
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              نوع ساختمان
              <select {...register("buildingType")} aria-invalid={Boolean(errors.buildingType)} className="mt-2 h-12 w-full rounded-xl border-slate-200 text-sm text-slate-600 focus:border-brand focus:ring-brand">
                <option value="">انتخاب کنید</option>
                <option value="residential">مسکونی</option>
                <option value="commercial">تجاری / اداری</option>
                <option value="industrial">صنعتی</option>
              </select>
              {errors.buildingType && <span className="mt-1 block text-xs text-red-600">{errors.buildingType.message}</span>}
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              تعداد طبقات / توقف
              <input {...register("stops", { valueAsNumber: true })} type="number" min={1} max={100} className="mt-2 h-12 w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand" />
              {errors.stops && <span className="mt-1 block text-xs text-red-600">{errors.stops.message}</span>}
            </label>
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              توضیحات (اختیاری)
              <textarea
                {...register("details")}
                rows={3}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={errors.details ? "quote-details-error" : undefined}
                className="mt-2 w-full resize-y rounded-xl border-slate-200 text-sm placeholder:text-slate-400 focus:border-brand focus:ring-brand"
                placeholder="نوع ساختمان، تعداد طبقات یا شرح درخواست..."
              />
              {errors.details && <span id="quote-details-error" className="mt-1 block text-xs text-red-600">{errors.details.message}</span>}
            </label>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              ثبت درخواست
              <ArrowLeft size={16} />
            </button>
            {submitted && (
              <p role="status" className="flex items-center gap-2 text-xs leading-6 text-gold-secondary">
                <CheckCircle2 size={17} className="shrink-0" />
                درخواست شما ثبت شد؛ کارشناسان با شما تماس می‌گیرند.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
