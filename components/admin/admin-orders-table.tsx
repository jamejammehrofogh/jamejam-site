"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { toman } from "@/lib/store-data";
import { getStoreOrders, type StoreOrder } from "@/data/mockData";

const paymentLabels = {
  gateway: "درگاه آنلاین",
  transfer: "کارت‌به‌کارت",
  in_person: "پرداخت حضوری",
} as const;

export function AdminOrdersTable() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setOrders(getStoreOrders());
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "دریافت سفارش‌ها انجام نشد.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#14120f]">
      <div className="border-b border-white/10 p-5 sm:p-6"><h1 className="text-xl font-black text-amber-50">سفارش‌های فروشگاه</h1><p className="mt-2 text-sm text-stone-400">سفارش‌های ثبت‌شده برای قطعات و تجهیزات آسانسور</p></div>
      {error ? <p role="alert" className="p-6 text-sm text-red-300">{error}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-right text-sm">
            <thead className="bg-white/[0.03] text-xs text-stone-400"><tr><th className="px-5 py-3 font-medium">کد سفارش</th><th className="px-5 py-3 font-medium">مشتری</th><th className="px-5 py-3 font-medium">اقلام</th><th className="px-5 py-3 font-medium">مبلغ</th><th className="px-5 py-3 font-medium">پرداخت</th><th className="px-5 py-3 font-medium">ثبت</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {loading ? <tr><td colSpan={6} className="px-5 py-10 text-center text-stone-400">در حال دریافت سفارش‌ها...</td></tr> :
                orders.length ? orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-5 py-4 font-mono text-xs text-[#d6b66c]">{order.id}</td>
                    <td className="px-5 py-4"><p className="font-bold text-amber-50">{order.name}</p><p dir="ltr" className="mt-1 text-left text-xs text-stone-500">{order.phone}</p></td>
                    <td className="px-5 py-4 text-stone-300">{order.items.map((item) => `${item.title} (${item.quantity})`).join("، ")}</td>
                    <td className="px-5 py-4 font-bold text-[#d6b66c]">{toman(order.total)}</td>
                    <td className="px-5 py-4 text-stone-300">{paymentLabels[order.paymentMethod]}</td>
                    <td className="px-5 py-4 text-xs text-stone-500">{new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date(order.createdAt))}</td>
                  </tr>
                )) : <tr><td colSpan={6} className="px-5 py-10 text-center text-stone-400">هنوز سفارشی ثبت نشده است.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
