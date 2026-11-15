import type { Metadata } from "next";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata: Metadata = {
  title: "تکمیل سفارش",
  description: "ثبت اطلاعات خریدار و تکمیل سفارش قطعات آسانسور.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-[75vh] bg-[#0c0b09] px-4 py-10 text-amber-50 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold text-[#d6b66c]">فروشگاه جام جم</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">تکمیل سفارش</h1>
        <p className="mt-3 text-sm text-stone-400">اطلاعات ارسال و روش پرداخت را انتخاب کنید.</p>
        <CheckoutForm />
      </div>
    </div>
  );
}
