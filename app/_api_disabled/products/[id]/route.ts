import { z } from "zod";
import { database } from "@/lib/mock-db";

const productSchema = z.object({
  title: z.string().trim().min(2).max(100),
  category: z.enum(["motors", "panels", "doors", "cabins", "rails", "safety", "cables"]),
  sku: z.string().trim().min(2).max(40),
  brand: z.string().trim().min(2).max(80),
  price: z.number().int().positive(),
  stock: z.number().int().min(0).max(100000),
  description: z.string().trim().min(2).max(1000),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const product = database.products.find((item) => item.id === id);
  if (!product) return Response.json({ message: "محصول پیدا نشد." }, { status: 404 });

  Object.assign(product, {
    ...result.data,
    stockStatus: result.data.stock > 0 ? (result.data.stock < 4 ? "low_stock" : "in_stock") : "out_of_stock",
  });
  return Response.json({ product });
}
