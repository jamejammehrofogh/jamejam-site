import type { Metadata } from "next";
import { ProductManager } from "@/components/admin/product-manager";

export const metadata: Metadata = { title: "محصولات | پنل مدیریت" };

export default function AdminProductsPage() {
  return <ProductManager />;
}
