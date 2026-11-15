"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Boxes, ClipboardList, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { getQuoteRequests, getStoreOrders, projects, products, type QuoteSubmission, type StoreOrder } from "@/data/mockData";

export function AdminOverview() {
  const [leads, setLeads] = useState<QuoteSubmission[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  useEffect(() => {
    try {
      setLeads(getQuoteRequests());
      setOrders(getStoreOrders());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "دریافت اطلاعات نمای کلی انجام نشد.");
    }
  }, []);

  const stats = [
    { label: "درخواست‌های ثبت‌شده", value: leads.length, href: "/admin/leads", icon: ClipboardList },
    { label: "سفارش‌های فروشگاه", value: orders.length, href: "/admin/orders", icon: PackageCheck },
    { label: "محصولات فعال", value: products.filter((product) => product.stock > 0).length, href: "/admin/products", icon: Boxes },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><p className="text-sm text-stone-500">خوش آمدید</p><h1 className="mt-1 text-2xl font-black text-amber-50">نمای کلی سامانه</h1></div>
        <p className="text-xs text-stone-500">مدیریت درخواست‌ها، سفارش‌ها و محصولات</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-2xl border border-white/10 bg-[#14120f] p-5 transition hover:border-[#c3a258]/50">
            <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3a258]/10 text-[#d6b66c]"><Icon size={19} /></span><ArrowLeft size={16} className="text-stone-600" /></div>
            <p className="mt-5 text-sm text-stone-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-amber-50">{new Intl.NumberFormat("fa-IR").format(value)}</p>
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-stone-500">{new Intl.NumberFormat("fa-IR").format(projects.length)} پروژهٔ نمونه در گالری ثبت شده است.</p>
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#14120f]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-extrabold text-amber-50">آخرین درخواست‌ها</h2>
          <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs font-bold text-[#d6b66c]">مشاهده همه <ArrowLeft size={14} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-right text-sm">
            <thead className="bg-white/[0.03] text-xs text-stone-400"><tr><th className="px-5 py-3 font-medium">نام مشتری</th><th className="px-5 py-3 font-medium">نوع درخواست</th><th className="px-5 py-3 font-medium">شماره تماس</th><th className="px-5 py-3 font-medium">وضعیت</th></tr></thead>
            <tbody className="divide-y divide-white/10">{leads.slice(0, 5).map((lead) => <tr key={lead.id}><td className="px-5 py-4 font-bold text-amber-50">{lead.name}</td><td className="px-5 py-4 text-stone-300">{lead.service}</td><td dir="ltr" className="px-5 py-4 text-left text-stone-400">{lead.phone}</td><td className="px-5 py-4"><span className="rounded-full bg-[#c3a258]/10 px-3 py-1 text-xs font-bold text-[#d6b66c]">{lead.status === "new" ? "جدید" : lead.status === "contacted" ? "تماس گرفته شد" : lead.status === "proposal_sent" ? "پیشنهاد ارسال شد" : "بسته‌شده"}</span></td></tr>)}
            </tbody>
          </table>
          {leads.length === 0 && <p className="px-5 py-8 text-center text-sm text-stone-500">هنوز درخواستی ثبت نشده است.</p>}
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/admin/products" className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#14120f] p-5 transition hover:border-[#c3a258]/40">
          <div><h2 className="font-extrabold text-amber-50">مدیریت محصولات</h2><p className="mt-2 text-xs leading-6 text-stone-500">افزودن و ویرایش محصولات فروشگاه</p></div><ArrowLeft size={18} className="text-[#d6b66c]" />
        </Link>
        <Link href="/admin/orders" className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#14120f] p-5 transition hover:border-[#c3a258]/40">
          <div><h2 className="font-extrabold text-amber-50">سفارش‌های فروشگاه</h2><p className="mt-2 text-xs leading-6 text-stone-500">مشاهده و پیگیری سفارش‌های قطعات</p></div><ArrowLeft size={18} className="text-[#d6b66c]" />
        </Link>
      </section>
    </div>
  );
}
