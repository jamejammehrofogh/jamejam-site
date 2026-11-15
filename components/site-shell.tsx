"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ContactFab } from "@/components/contact-fab";
import { Footer } from "@/components/site-footer";
import { Header } from "@/components/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ContactFab />}
    </>
  );
}
