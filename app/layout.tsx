import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-provider";
import { SiteShell } from "@/components/site-shell";
import { Toaster } from "sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamjamelevator.ir"),
  title: {
    default: "شرکت آسانسور جام جم | طراحی، نصب و نگهداری آسانسور",
    template: "%s | آسانسور جام جم",
  },
  description:
    "شرکت آسانسور جام جم به مدیریت آقای خوزان؛ ارائه‌دهنده خدمات طراحی، نصب، تعمیر، نگهداری و نوسازی آسانسور و تأمین قطعات.",
  keywords: [
    "آسانسور جام جم",
    "نصب آسانسور",
    "تعمیر آسانسور",
    "نگهداری آسانسور",
    "قطعات آسانسور",
  ],
  openGraph: {
    title: "شرکت آسانسور جام جم",
    description: "راهکارهای ایمن و مطمئن آسانسور، از طراحی تا نگهداری.",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <CartProvider>
          <SiteShell>{children}</SiteShell>
          <Toaster
            position="top-center"
            dir="rtl"
            toastOptions={{
              className: "border border-amber-500/30 bg-[#17140f] text-amber-50 shadow-xl",
              style: { fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" },
            }}
            richColors
          />
        </CartProvider>
      </body>
    </html>
  );
}
