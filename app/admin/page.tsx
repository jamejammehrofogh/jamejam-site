import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = { title: "نمای کلی | پنل مدیریت" };

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
