"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Printer, ReceiptText } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { saveQuoteRequest, toLatinDigits, toman } from "@/data/mockData";

type BuildingType = "residential" | "commercial" | "industrial";
type DriveType = "traction" | "hydraulic";
type DoorType = "automatic" | "telescopic";
type CabinStyle = "stainless" | "gold_glass";

type EstimatorValues = {
  buildingType: BuildingType | "";
  stops: number;
  capacity: number | "";
  driveType: DriveType | "";
  doorType: DoorType | "";
  cabinStyle: CabinStyle | "";
  name: string;
  phone: string;
  city: string;
};

type InvoiceBreakdown = {
  mechanical: number;
  cabin: number;
  installation: number;
  doorRail: number;
  total: number;
};

const buildingLabels: Record<BuildingType, string> = {
  residential: "مسکونی",
  commercial: "تجاری",
  industrial: "صنعتی",
};

const capacityOptions = [
  { persons: 4, kg: 320 },
  { persons: 6, kg: 450 },
  { persons: 8, kg: 600 },
  { persons: 10, kg: 750 },
  { persons: 13, kg: 1000 },
];

const goldButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c3a258] px-5 py-3 text-sm font-black text-[#17130b] shadow-[0_0_24px_rgba(195,162,88,0.13)] transition hover:bg-[#d8bc78] disabled:cursor-not-allowed disabled:opacity-50";

const fieldClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0e0d0b]/90 px-3 text-sm text-amber-50 placeholder:text-stone-600 focus:border-[#d6b66c] focus:ring-1 focus:ring-[#d6b66c]";

function calculateEstimate(values: EstimatorValues): InvoiceBreakdown {
  const capacity = capacityOptions.find((option) => option.persons === values.capacity) ?? capacityOptions[1];
  const buildingMultiplier =
    values.buildingType === "industrial" ? 1.28 : values.buildingType === "commercial" ? 1.15 : 1;
  const driveMultiplier = values.driveType === "hydraulic" ? 1.12 : 1;
  const capacityRatio = capacity.kg / 600;
  const stops = values.stops;

  const mechanical = Math.round((48_000_000 + capacity.kg * 48_000 + stops * 3_800_000) * buildingMultiplier * driveMultiplier);
  const cabinBase = values.cabinStyle === "gold_glass" ? 67_000_000 : 42_000_000;
  const cabin = Math.round(cabinBase * capacityRatio * buildingMultiplier);
  const installation = Math.round((24_000_000 + stops * 2_400_000 + capacity.kg * 10_000) * buildingMultiplier);
  const doorRailBase = 17_000_000 + stops * 1_350_000 + capacity.kg * 8_000;
  const doorRail = Math.round((doorRailBase + (values.doorType === "telescopic" ? 8_500_000 : 0)) * buildingMultiplier);

  return {
    mechanical,
    cabin,
    installation,
    doorRail,
    total: mechanical + cabin + installation + doorRail,
  };
}

function isBuildingType(value: string): value is BuildingType {
  return value === "residential" || value === "commercial" || value === "industrial";
}

function SelectCard({
  name,
  title,
  description,
  selected,
  onSelect,
}: {
  name: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`rounded-2xl border p-4 text-right transition ${
        selected
          ? "border-[#d6b66c]/70 bg-[#c3a258]/10 shadow-[0_0_20px_rgba(195,162,88,0.08)]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-sm font-bold text-amber-50">{title}</span>
          <span className="mt-1 block text-xs leading-6 text-stone-400">{description}</span>
        </span>
        <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[#d6b66c] bg-[#c3a258] text-[#17130b]" : "border-stone-600 text-transparent"}`}>
          <Check size={12} />
        </span>
      </span>
      <span className="sr-only">{name}</span>
    </button>
  );
}

export function InvoiceEstimator() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<EstimatorValues>({
    buildingType: "",
    stops: 6,
    capacity: "",
    driveType: "",
    doorType: "",
    cabinStyle: "",
    name: "",
    phone: "",
    city: "",
  });
  const [stepError, setStepError] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const breakdown = useMemo(() => calculateEstimate(values), [values]);
  const selectedCapacity = capacityOptions.find((option) => option.persons === values.capacity);
  const dateLabel = invoiceDate
    ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(new Date(invoiceDate))
    : "";

  function update<K extends keyof EstimatorValues>(key: K, value: EstimatorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setStepError("");
    if (isSaved) setIsSaved(false);
  }

  function validateCurrentStep() {
    if (step === 0 && (!isBuildingType(values.buildingType) || !values.capacity || values.stops < 2 || values.stops > 30)) {
      setStepError("نوع ساختمان، ظرفیت و تعداد توقف بین ۲ تا ۳۰ را انتخاب کنید.");
      return false;
    }
    if (step === 1 && (!values.driveType || !values.doorType || !values.cabinStyle)) {
      setStepError("همه مشخصات آسانسور را انتخاب کنید.");
      return false;
    }
    if (step === 2) {
      const phone = toLatinDigits(values.phone.trim());
      if (values.name.trim().length < 2 || !/^09\d{9}$/.test(phone) || values.city.trim().length < 2) {
        setStepError("نام، شماره همراه معتبر و شهر/موقعیت را کامل وارد کنید.");
        return false;
      }
      setValues((current) => ({ ...current, phone }));
      setInvoiceDate(new Date().toISOString());
    }
    setStepError("");
    return true;
  }

  function handleStepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    setStep((current) => Math.min(current + 1, 3));
  }

  function submitRequest() {
    if (!invoiceDate) return;
    try {
      saveQuoteRequest({
        name: values.name.trim(),
        phone: toLatinDigits(values.phone),
        service: "installation",
        buildingType: values.buildingType,
        stops: values.stops,
        capacity: String(values.capacity),
        city: values.city.trim(),
        details: [
          `محرکه: ${values.driveType === "traction" ? "کششی" : "هیدرولیک"}`,
          `درب: ${values.doorType === "automatic" ? "اتوماتیک" : "تلسکوپی"}`,
          `کابین: ${values.cabinStyle === "stainless" ? "استیل" : "شیشه طلایی لوکس"}`,
          `برآورد: ${breakdown.total} تومان`,
        ].join(" · "),
      });
      setIsSaved(true);
      toast.success("درخواست و پیش‌فاکتور در همین مرورگر ذخیره شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ذخیره درخواست انجام نشد.");
    }
  }

  const steps = ["مشخصات ساختمان", "مشخصات آسانسور", "اطلاعات تماس"];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(195,162,88,0.12),transparent_50%),#0c0b09] px-4 py-10 text-amber-50 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="no-print mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d6b66c]/20 bg-[#c3a258]/[0.06] px-4 py-2 text-xs font-bold text-[#d6b66c]">
            <ReceiptText size={15} /> برآورد اولیه پروژه
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">محاسبه‌گر قیمت آسانسور</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-400">
            مشخصات پروژه را وارد کنید تا پیش‌فاکتور آنلاین و قابل چاپ خود را دریافت کنید.
          </p>
        </header>

        {step < 3 && (
          <section className="no-print mx-auto max-w-3xl rounded-3xl border border-[#d6b66c]/15 bg-white/[0.035] p-5 shadow-[0_20px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-stone-400">
                <span>مرحله {new Intl.NumberFormat("fa-IR").format(step + 1)} از ۳</span>
                <span className="text-[#d6b66c]">{steps[step]}</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-[#e4ca86] to-[#9d7831]"
                  animate={{ width: `${((step + 1) / 3) * 100}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>

            <form onSubmit={handleStepSubmit}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-64"
                >
                  {step === 0 && (
                    <div>
                      <h2 className="text-lg font-extrabold">جزئیات ساختمان</h2>
                      <div className="mt-5">
                        <p className="text-sm font-semibold text-stone-300">نوع ساختمان</p>
                        <div role="radiogroup" aria-label="نوع ساختمان" className="mt-3 grid gap-3 sm:grid-cols-3">
                          {([
                            ["residential", "مسکونی", "ساختمان‌های مسکونی"],
                            ["commercial", "تجاری", "مراکز اداری و پرتردد"],
                            ["industrial", "صنعتی", "کارخانه و کاربری بار"],
                          ] as const).map(([value, title, description]) => (
                            <SelectCard key={value} name="buildingType" title={title} description={description} selected={values.buildingType === value} onSelect={() => update("buildingType", value)} />
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-stone-300">
                          تعداد توقف / طبقات
                          <input type="number" min={2} max={30} value={values.stops} onChange={(event) => update("stops", Number(event.target.value))} className={fieldClass} />
                          <span className="mt-1 block text-xs text-stone-500">از ۲ تا ۳۰ توقف</span>
                        </label>
                        <label className="text-sm font-semibold text-stone-300">
                          ظرفیت آسانسور
                          <select value={values.capacity} onChange={(event) => update("capacity", event.target.value ? Number(event.target.value) : "")} className={fieldClass}>
                            <option value="">انتخاب ظرفیت</option>
                            {capacityOptions.map((option) => <option key={option.persons} value={option.persons}>{option.persons} نفر / {option.kg} کیلوگرم</option>)}
                          </select>
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-extrabold">مشخصات آسانسور</h2>
                      <fieldset>
                        <legend className="text-sm font-semibold text-stone-300">نوع محرکه</legend>
                        <div role="radiogroup" className="mt-3 grid gap-3 sm:grid-cols-2">
                          <SelectCard name="driveType" title="کششی" description="حرکت نرم و مناسب ساختمان‌های چندطبقه" selected={values.driveType === "traction"} onSelect={() => update("driveType", "traction")} />
                          <SelectCard name="driveType" title="هیدرولیک" description="گزینه‌ای مناسب برای پروژه‌های کم‌ارتفاع" selected={values.driveType === "hydraulic"} onSelect={() => update("driveType", "hydraulic")} />
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="text-sm font-semibold text-stone-300">نوع درب</legend>
                        <div role="radiogroup" className="mt-3 grid gap-3 sm:grid-cols-2">
                          <SelectCard name="doorType" title="اتوماتیک" description="بازشوی اتوماتیک با کاربری آسان" selected={values.doorType === "automatic"} onSelect={() => update("doorType", "automatic")} />
                          <SelectCard name="doorType" title="تلسکوپی" description="بازشوی چندلته برای عبور سریع‌تر" selected={values.doorType === "telescopic"} onSelect={() => update("doorType", "telescopic")} />
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="text-sm font-semibold text-stone-300">سبک کابین</legend>
                        <div role="radiogroup" className="mt-3 grid gap-3 sm:grid-cols-2">
                          <SelectCard name="cabinStyle" title="استیل" description="پوشش بادوام و ظاهر کلاسیک" selected={values.cabinStyle === "stainless"} onSelect={() => update("cabinStyle", "stainless")} />
                          <SelectCard name="cabinStyle" title="شیشه طلایی لوکس" description="جزئیات طلایی و طراحی شاخص" selected={values.cabinStyle === "gold_glass"} onSelect={() => update("cabinStyle", "gold_glass")} />
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h2 className="text-lg font-extrabold">اطلاعات تماس</h2>
                      <p className="mt-2 text-sm leading-6 text-stone-400">برای ثبت پیش‌فاکتور و پیگیری پروژه، اطلاعات زیر را وارد کنید.</p>
                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <label className="text-sm font-semibold text-stone-300">
                          نام مشتری
                          <input autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} placeholder="نام و نام خانوادگی" />
                        </label>
                        <label className="text-sm font-semibold text-stone-300">
                          شماره همراه
                          <input type="tel" inputMode="numeric" dir="ltr" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} className={`${fieldClass} text-left`} placeholder="0912xxxxxxx" />
                        </label>
                        <label className="text-sm font-semibold text-stone-300 sm:col-span-2">
                          شهر / موقعیت پروژه
                          <input value={values.city} onChange={(event) => update("city", event.target.value)} className={fieldClass} placeholder="مثلاً تهران، سعادت‌آباد" />
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                {step > 0 ? (
                  <button type="button" onClick={() => { setStep((current) => current - 1); setStepError(""); }} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-stone-300 transition hover:bg-white/5">
                    <ArrowRight size={16} /> مرحله قبل
                  </button>
                ) : <span />}
                <button type="submit" className={goldButton}>
                  {step === 2 ? "ساخت پیش‌فاکتور" : "ادامه"}
                  <ArrowLeft size={16} />
                </button>
              </div>
              {stepError && <p role="alert" className="mt-3 text-sm text-rose-300">{stepError}</p>}
            </form>
          </section>
        )}

        {step === 3 && invoiceDate && (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl"
          >
            <div className="invoice-print-sheet overflow-hidden rounded-3xl border border-[#d6b66c]/30 bg-[#17140f] shadow-[0_25px_100px_rgba(0,0,0,0.5),0_0_45px_rgba(195,162,88,0.08)]">
              <div className="relative border-b border-[#d6b66c]/25 bg-gradient-to-l from-[#342916] via-[#1b1812] to-[#17140f] p-6 sm:p-9">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#e4ca86] to-transparent" />
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-[#d6b66c]">JAM JAM ELEVATOR CO.</p>
                    <h2 className="mt-3 text-2xl font-black sm:text-3xl">شرکت آسانسور جام جم</h2>
                    <p className="mt-2 text-sm text-stone-300">مدیر: آقای خوزان</p>
                    <p dir="ltr" className="mt-1 text-right text-sm text-stone-300">09126975580</p>
                  </div>
                  <div className="rounded-2xl border border-[#d6b66c]/25 bg-black/20 px-5 py-4 sm:min-w-52">
                    <span className="text-xs text-stone-400">پیش‌فاکتور آنلاین</span>
                    <p className="mt-1 text-lg font-black text-[#e4ca86]">JJ-{new Date(invoiceDate).getTime().toString().slice(-8)}</p>
                    <p className="mt-2 text-xs text-stone-400">{dateLabel}</p>
                  </div>
                </div>
                <div className="mt-7 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
                  <p><span className="text-stone-500">مشتری: </span><strong>{values.name}</strong></p>
                  <p><span className="text-stone-500">تماس: </span><strong dir="ltr" className="inline-block">{values.phone}</strong></p>
                  <p><span className="text-stone-500">موقعیت: </span><strong>{values.city}</strong></p>
                </div>
              </div>

              <div className="p-6 sm:p-9">
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-400">
                  <span>ساختمان: <strong className="text-amber-50">{values.buildingType ? buildingLabels[values.buildingType] : ""}</strong></span>
                  <span>توقف: <strong className="text-amber-50">{new Intl.NumberFormat("fa-IR").format(values.stops)}</strong></span>
                  <span>ظرفیت: <strong className="text-amber-50">{selectedCapacity?.persons} نفر / {selectedCapacity?.kg} کیلوگرم</strong></span>
                  <span>محرکه: <strong className="text-amber-50">{values.driveType === "traction" ? "کششی" : "هیدرولیک"}</strong></span>
                  <span>درب: <strong className="text-amber-50">{values.doorType === "automatic" ? "اتوماتیک" : "تلسکوپی"}</strong></span>
                  <span>کابین: <strong className="text-amber-50">{values.cabinStyle === "stainless" ? "استیل" : "شیشه طلایی لوکس"}</strong></span>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1fr_auto] gap-4 bg-white/[0.04] px-4 py-3 text-xs font-bold text-stone-400 sm:px-5">
                    <span>شرح هزینه</span><span>مبلغ برآوردی</span>
                  </div>
                  <div className="divide-y divide-white/10">
                    {[
                      ["قطعات مکانیکی و سیستم محرکه", breakdown.mechanical],
                      ["کابین و تزئینات داخلی", breakdown.cabin],
                      ["نصب، راه‌اندازی و دستمزد", breakdown.installation],
                      ["پکیج درب و ریل", breakdown.doorRail],
                    ].map(([label, amount]) => (
                      <div key={label} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4 text-sm sm:px-5">
                        <span className="text-stone-300">{label}</span>
                        <strong className="whitespace-nowrap text-amber-50">{toman(Number(amount))}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-[#d6b66c]/30 bg-[#c3a258]/[0.08] px-4 py-5 sm:px-5">
                    <span className="font-black">مبلغ کل برآوردی</span>
                    <strong className="whitespace-nowrap text-lg font-black text-[#e4ca86] sm:text-xl">{toman(breakdown.total)}</strong>
                  </div>
                </div>

                <p className="mt-5 text-xs leading-6 text-stone-500">
                  این پیش‌فاکتور بر اساس اطلاعات واردشده و نرخ‌های نمونهٔ محاسبه‌گر تهیه شده و صرفاً برآورد اولیه است؛ قیمت نهایی پس از بازدید فنی و تأیید مشخصات پروژه اعلام می‌شود.
                </p>
              </div>
              <div className="border-t border-[#d6b66c]/20 px-6 py-4 text-center text-[11px] text-stone-500 sm:px-9">
                شرکت آسانسور جام جم · کیفیت، ایمنی و اعتماد
              </div>
            </div>

            <div className="no-print mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d6b66c]/35 bg-white/[0.03] px-5 py-3 text-sm font-bold text-[#e4ca86] transition hover:bg-[#c3a258]/10">
                <Printer size={17} /> چاپ / ذخیره PDF
              </button>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => { setStep(2); setIsSaved(false); }} className="min-h-12 rounded-xl px-4 py-3 text-sm font-bold text-stone-300 transition hover:bg-white/5">
                  ویرایش اطلاعات
                </button>
                <button type="button" onClick={submitRequest} disabled={isSaved} className={goldButton}>
                  {isSaved ? <><Check size={16} /> درخواست ذخیره شد</> : "ثبت درخواست در مرورگر"}
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
