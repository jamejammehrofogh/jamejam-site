import type { Metadata } from "next";
import { InvoiceEstimator } from "@/components/quote/invoice-estimator";

export const metadata: Metadata = {
  title: "محاسبه‌گر قیمت و پیش‌فاکتور",
};

export default function QuoteInvoicePage() {
  return <InvoiceEstimator />;
}
