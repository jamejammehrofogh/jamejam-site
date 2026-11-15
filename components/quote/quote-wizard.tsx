"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { saveQuoteRequest } from "@/data/mockData";

const quoteSchema = z.object({
  service: z.enum(["installation", "maintenance", "repair", "parts"], {
    error: "نوع خدمت را انتخاب کنید.",
  }),
  buildingType: z.enum(["residential", "commercial", "industrial"], {
    error: "نوع ساختمان را انتخاب کنید.",
  }),
  stops: z.number().int().min(2, "حداقل تعداد توقف ۲ است.").max(40, "تعداد توقف نمی‌تواند بیشتر از ۴۰ باشد."),
  capacity: z.enum(["4", "6", "8", "10", "13"], {
    error: "ظرفیت آسانسور را انتخاب کنید.",
  }),
  name: z.string().trim().min(2, "نام را کامل وارد کنید.").max(80, "نام بیش از حد طولانی است."),
  phone: z
    .string()
    .trim()
    .transform(toLatinDigits)
    .pipe(z.string().regex(/^0912\d{7}$/, "شماره باید با ۰۹۱۲ شروع شود و ۱۱ رقم باشد.")),
});

type QuoteValues = z.infer<typeof quoteSchema>;

function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

const stepFields: (keyof QuoteValues)[][] = [
  ["service", "buildingType"],
  ["stops", "capacity"],
  ["name", "phone"],
];

const inputClass =
  "mt-2 h-12 w-full rounded-xl border-slate-200 text-sm focus:border-brand focus:ring-brand";

export function QuoteWizard({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      service: initialService === "parts" ? "parts" : undefined,
      stops: 6,
    },
    mode: "onTouched",
  });

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((current) => Math.min(current + 1, stepFields.length - 1));
  };

  const submit = async (values: QuoteValues) => {
    try {
      saveQuoteRequest(values);
      setSent(true);
      toast.success("درخواست مشاوره شما با موفقیت ثبت شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت درخواست انجام نشد.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card sm:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>مرحله {new Intl.NumberFormat("fa-IR").format(step + 1)} از ۳</span>
          <span>{["مشخصات پروژه", "مشخصات آسانسور", "اطلاعات تماس"][step]}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div className="h-full rounded-full bg-brand" animate={{ width: `${((step + 1) / 3) * 100}%` }} transition={{ duration: 0.25 }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="min-h-56"
          >
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  نوع خدمت
                  <select {...register("service")} className={inputClass}>
                    <option value="">انتخاب خدمت</option>
                    <option value="installation">طراحی و نصب آسانسور</option>
                    <option value="maintenance">سرویس و نگهداری</option>
                    <option value="repair">تعمیرات تخصصی</option>
                    <option value="parts">تأمین قطعات</option>
                  </select>
                  {errors.service && <span className="mt-1 block text-xs text-red-600">{errors.service.message}</span>}
                </label>
                <label className="text-sm font-bold text-slate-700">
                  نوع ساختمان
                  <select {...register("buildingType")} className={inputClass}>
                    <option value="">انتخاب نوع ساختمان</option>
                    <option value="residential">مسکونی</option>
                    <option value="commercial">تجاری / اداری</option>
                    <option value="industrial">صنعتی</option>
                  </select>
                  {errors.buildingType && <span className="mt-1 block text-xs text-red-600">{errors.buildingType.message}</span>}
                </label>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  تعداد توقف / طبقات
                  <input {...register("stops", { valueAsNumber: true })} type="number" min={2} max={40} className={inputClass} />
                  {errors.stops && <span className="mt-1 block text-xs text-red-600">{errors.stops.message}</span>}
                </label>
                <label className="text-sm font-bold text-slate-700">
                  ظرفیت آسانسور
                  <select {...register("capacity")} className={inputClass}>
                    <option value="">انتخاب ظرفیت</option>
                    <option value="4">۴ نفر</option>
                    <option value="6">۶ نفر</option>
                    <option value="8">۸ نفر</option>
                    <option value="10">۱۰ نفر</option>
                    <option value="13">۱۳ نفر</option>
                  </select>
                  {errors.capacity && <span className="mt-1 block text-xs text-red-600">{errors.capacity.message}</span>}
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700">
                  نام و نام خانوادگی
                  <input {...register("name")} autoComplete="name" className={inputClass} placeholder="نام شما" />
                  {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
                </label>
                <label className="text-sm font-bold text-slate-700">
                  شماره همراه
                  <input {...register("phone")} type="tel" inputMode="numeric" dir="ltr" autoComplete="tel" className={`${inputClass} text-left`} placeholder="0912xxxxxxx" />
                  {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone.message}</span>}
                </label>
                <p className="text-xs leading-6 text-slate-500 sm:col-span-2">کارشناسان جام جم برای بررسی درخواست و هماهنگی مشاوره با شما تماس می‌گیرند.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
              <ArrowRight size={16} /> مرحله قبل
            </button>
          ) : <span />}
          {step < 2 ? (
            <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark">
              ادامه <ArrowLeft size={16} />
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60">
              ثبت درخواست <CheckCircle2 size={16} />
            </button>
          )}
        </div>
        {sent && <p role="status" className="mt-4 text-sm font-medium text-gold-secondary">درخواست شما ثبت شد؛ کارشناسان جام جم با شما تماس می‌گیرند.</p>}
      </form>
    </div>
  );
}
