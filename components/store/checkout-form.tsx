"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Check, ChevronLeft, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/store/cart-provider";
import { toman } from "@/lib/store-data";
import { saveStoreOrder, toLatinDigits } from "@/data/mockData";

type PaymentMethod = "gateway" | "transfer" | "in_person";

const paymentOptions: { value: PaymentMethod; title: string; description: string }[] = [
  { value: "gateway", title: "درگاه آنلاین", description: "پرداخت امن آنلاین (آزمایشی)" },
  { value: "transfer", title: "واریز کارت‌به‌کارت", description: "هماهنگی اطلاعات حساب پس از ثبت سفارش" },
  { value: "in_person", title: "پرداخت حضوری", description: "پرداخت هنگام مراجعه یا تحویل" },
];

export function CheckoutForm() {
  const { items, clear, ready } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gateway");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      toast.error("سبد خرید شما خالی است.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const order = saveStoreOrder({
        name: String(formData.get("name") ?? ""),
        phone: toLatinDigits(String(formData.get("phone") ?? "")),
        address: String(formData.get("address") ?? ""),
        paymentMethod,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title,
          quantity,
          price: product.price,
        })),
      });
      clear();
      setConfirmedOrder(order);
      toast.success("سفارش شما با موفقیت ثبت شد.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ثبت سفارش انجام نشد.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!ready) {
    return <div role="status" className="mt-8 rounded-3xl border border-white/10 bg-[#17140f] p-10 text-center text-sm text-stone-400">در حال بارگذاری سبد خرید...</div>;
  }

  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="mt-8 rounded-3xl border border-white/10 bg-[#17140f] p-10 text-center">
        <ShoppingBag className="mx-auto text-[#d6b66c]" size={38} />
        <h2 className="mt-4 text-lg font-bold">سبد خرید شما خالی است</h2>
        <Link href="/store" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#b9954b] px-5 py-3 text-sm font-bold text-[#17130b]">
          بازگشت به فروشگاه <ChevronLeft size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-[#17140f] p-5 sm:p-7">
          <h2 className="text-lg font-extrabold">اطلاعات مشتری</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-stone-300">
              نام و نام خانوادگی
              <input name="name" autoComplete="name" required minLength={2} maxLength={80} className="mt-2 h-12 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white placeholder:text-stone-600 focus:border-[#d6b66c] focus:ring-[#d6b66c]" placeholder="نام شما" />
            </label>
            <label className="text-sm font-semibold text-stone-300">
              شماره همراه
              <input name="phone" type="tel" dir="ltr" inputMode="numeric" autoComplete="tel" required pattern="0912[0-9]{7}" title="شماره همراه باید با 0912 شروع شود و ۱۱ رقم باشد." className="mt-2 h-12 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-left text-sm text-white placeholder:text-stone-600 focus:border-[#d6b66c] focus:ring-[#d6b66c]" placeholder="0912xxxxxxx" />
            </label>
            <label className="text-sm font-semibold text-stone-300 sm:col-span-2">
              نشانی کامل
              <textarea name="address" required minLength={8} maxLength={500} rows={3} className="mt-2 w-full rounded-xl border-white/10 bg-[#0e0d0b] text-sm text-white placeholder:text-stone-600 focus:border-[#d6b66c] focus:ring-[#d6b66c]" placeholder="استان، شهر، خیابان، پلاک و کد پستی (در صورت وجود)" />
            </label>
          </div>
          <fieldset className="mt-7">
            <legend className="text-sm font-extrabold">روش پرداخت</legend>
            <div className="mt-3 grid gap-3">
              {paymentOptions.map((option) => (
                <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${paymentMethod === option.value ? "border-[#d6b66c]/70 bg-[#d6b66c]/10" : "border-white/10 hover:border-white/20"}`}>
                  <input type="radio" name="paymentMethod" value={option.value} checked={paymentMethod === option.value} onChange={() => setPaymentMethod(option.value)} className="mt-1 border-stone-500 bg-[#0e0d0b] text-[#d6b66c] focus:ring-[#d6b66c]" />
                  <span><span className="block text-sm font-bold text-amber-50">{option.title}</span><span className="mt-1 block text-xs text-stone-400">{option.description}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" disabled={isSubmitting || !items.length} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c3a258] px-5 py-3 text-sm font-black text-[#17130b] transition hover:bg-[#d8bc78] disabled:cursor-not-allowed disabled:opacity-50">
            {isSubmitting ? "در حال ثبت سفارش..." : "ثبت سفارش"}
            <ChevronLeft size={17} />
          </button>
          <p className="mt-3 text-center text-[11px] leading-5 text-stone-500">پرداخت درگاه در این نسخه آزمایشی به درگاه بانکی متصل نیست.</p>
        </section>

        <aside className="h-fit rounded-3xl border border-white/10 bg-[#17140f] p-5 sm:p-7">
          <h2 className="text-lg font-extrabold">خلاصه سفارش</h2>
          <ul className="mt-5 divide-y divide-white/10">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                <div><p className="text-sm font-bold">{product.title}</p><p className="mt-1 text-xs text-stone-400">{quantity} × {toman(product.price)}</p></div>
                <p className="shrink-0 text-sm font-bold text-[#d6b66c]">{toman(product.price * quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="font-bold">مبلغ قابل پرداخت</span><span className="font-black text-[#d6b66c]">{toman(total)}</span>
          </div>
        </aside>
      </form>

      {confirmedOrder && (
        <div role="dialog" aria-modal="true" aria-labelledby="order-confirmed-title" className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-[#d6b66c]/30 bg-[#17140f] p-7 text-center shadow-2xl">
            <button type="button" onClick={() => setConfirmedOrder(null)} aria-label="بستن" className="absolute left-4 top-4 rounded-lg p-2 text-stone-400 hover:bg-white/5"><X size={18} /></button>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#d6b66c]/15 text-[#d6b66c]"><Check size={27} /></span>
            <h2 id="order-confirmed-title" className="mt-4 text-xl font-black">سفارش ثبت شد</h2>
            <p className="mt-2 text-sm leading-7 text-stone-400">سفارش شما با کد <span dir="ltr" className="font-bold text-[#d6b66c]">{confirmedOrder.id}</span> ثبت شد. کارشناسان برای هماهنگی با شما تماس می‌گیرند.</p>
            <p className="mt-4 font-bold">مبلغ سفارش: {toman(confirmedOrder.total)}</p>
            <Link href="/store" className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#c3a258] px-6 py-3 text-sm font-bold text-[#17130b]">بازگشت به فروشگاه</Link>
          </div>
        </div>
      )}
    </>
  );
}
