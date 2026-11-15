import type { Metadata } from "next";
import { AdminTrainingDashboard } from "@/components/training/admin-training-dashboard";

export const metadata: Metadata = {
  title: "مدیریت آموزش و گواهینامه‌ها",
};

export default function AdminTrainingPage() {
  return <AdminTrainingDashboard />;
}
