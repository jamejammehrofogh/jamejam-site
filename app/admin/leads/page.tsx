import type { Metadata } from "next";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata: Metadata = { title: "درخواست‌ها | پنل مدیریت" };

export default function AdminLeadsPage() {
  return <LeadsTable />;
}
