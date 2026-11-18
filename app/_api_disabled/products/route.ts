import { z } from "zod";
import { database } from "@/lib/mock-db";
import type { Product } from "@/data/mockData";

const productSchema = z.object({
  title: z.string().trim().min(2).max(100),
  category: z.enum(["motors", "panels", "doors", "cabins", "rails", "safety", "cables"]),
  sku: z.string().trim().min(2).max(40),
  brand: z.string().trim().min(2).max(80),
  price: z.number().int().positive(),
  stock: z.number().int().min(0).max(100000),
  description: z.string().trim().min(2).max(1000),
});

export async function GET() {
  return Response.json({ products: database.products });
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const result = productSchema.safeParse(input);
  if (!result.success) {
    return Response.json(
      { message: "اطلاعات محصول معتبر نیست.", errors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const product = {
    ...result.data,
    id: `product-${Date.now().toString(36)}`,
    stockStatus: result.data.stock === 0 ? "out_of_stock" as const : result.data.stock < 4 ? "low_stock" as const : "in_stock" as const,
    specs: [] as [string, string][],
    color: "from-amber-100 to-stone-300",
    image: "/images/service-elevator-1.svg",
  } satisfies Product;
  database.products.unshift(product);
  return Response.json({ product }, { status: 201 });
}
