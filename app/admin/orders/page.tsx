import type { Metadata } from "next";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";

export const metadata: Metadata = { title: "سفارش‌ها | پنل مدیریت" };

export default function AdminOrdersPage() {
  return <AdminOrdersTable />;
}
