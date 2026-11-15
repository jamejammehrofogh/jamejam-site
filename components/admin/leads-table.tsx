"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getQuoteRequests, updateQuoteRequestStatus, type QuoteSubmission, type QuoteStatus } from "@/data/mockData";

type Lead = QuoteSubmission;

const statuses: { value: QuoteStatus; label: string; className: string }[] = [
  { value: "new", label: "جدید", className: "bg-amber-400/10 text-amber-300" },
  { value: "contacted", label: "تماس گرفته شد", className: "bg-sky-400/10 text-sky-300" },
  { value: "proposal_sent", label: "پیشنهاد ارسال شد", className: "bg-violet-400/10 text-violet-300" },
  { value: "closed", label: "بسته‌شده", className: "bg-gold-primary/10 text-gold-light" },
];
const serviceLabels: Record<string, string> = {
  installation: "طراحی و نصب",
  maintenance: "سرویس و نگهداری",
  repair: "تعمیرات تخصصی",
  parts: "تأمین قطعات",
};
const buildingLabels: Record<string, string> = {
  residential: "مسکونی",
  commercial: "تجاری / اداری",
  industrial: "صنعتی",
};

export function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    try {
      setLeads(getQuoteRequests());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "دریافت درخواست‌ها انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, []);

  function updateStatus(id: string, status: QuoteStatus) {
    try {
      setLeads(updateQuoteRequestStatus(id, status));
      toast.success("وضعیت درخواست به‌روزرسانی شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "به‌روزرسانی وضعیت انجام نشد.");
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#14120f]">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <h1 className="text-xl font-black text-amber-50">درخواست‌ها و سرنخ‌ها</h1>
        <p className="mt-2 text-sm text-stone-400">درخواست‌های مشاوره ثبت‌شده و وضعیت پیگیری مشتریان</p>
      </div>
      {loadError ? <p role="alert" className="p-6 text-sm text-red-300">{loadError}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-right text-sm">
            <thead className="bg-white/[0.03] text-xs text-stone-400"><tr><th className="px-5 py-3 font-medium">مشتری</th><th className="px-5 py-3 font-medium">تماس</th><th className="px-5 py-3 font-medium">خدمت</th><th className="px-5 py-3 font-medium">مشخصات پروژه</th><th className="px-5 py-3 font-medium">ثبت</th><th className="px-5 py-3 font-medium">وضعیت</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {loading ? <tr><td colSpan={6} className="px-5 py-10 text-center text-stone-400">در حال دریافت درخواست‌ها...</td></tr> :
                leads.length ? leads.map((lead) => {
                  const status = statuses.find((item) => item.value === lead.status) ?? statuses[0];
                  return (
                    <tr key={lead.id}>
                      <td className="px-5 py-4 font-bold text-amber-50">{lead.name}</td>
                      <td className="px-5 py-4 text-left text-stone-300" dir="ltr">{lead.phone}</td>
                      <td className="px-5 py-4 text-stone-300">{serviceLabels[lead.service] ?? lead.service}</td>
                      <td className="px-5 py-4 text-stone-400">{[buildingLabels[lead.buildingType] ?? lead.buildingType, lead.stops ? `${lead.stops} توقف` : "", lead.capacity ? `${lead.capacity} نفر` : "", lead.city, lead.details].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="px-5 py-4 text-xs text-stone-500">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date(lead.createdAt))}</td>
                      <td className="px-5 py-4">
                        <label className="sr-only" htmlFor={`lead-status-${lead.id}`}>وضعیت {lead.name}</label>
                        <select id={`lead-status-${lead.id}`} value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value as QuoteStatus)} className={`rounded-full border-0 py-1.5 pl-7 pr-3 text-xs font-bold focus:ring-1 focus:ring-[#d6b66c] ${status.className} bg-[#1b1914]`}>
                          {statuses.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                }) : <tr><td colSpan={6} className="px-5 py-10 text-center text-stone-400">هنوز درخواستی ثبت نشده است.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
