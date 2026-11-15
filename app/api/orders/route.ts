import { z } from "zod";
import { createId, database } from "@/lib/mock-db";
import type { StoreOrder } from "@/data/mockData";

const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().transform(toLatinDigits).pipe(z.string().regex(/^0912\d{7}$/)),
  address: z.string().trim().min(8).max(500),
  paymentMethod: z.enum(["gateway", "transfer", "in_person"]),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50).refine(
    (items) => new Set(items.map((item) => item.productId)).size === items.length,
    "هر محصول فقط یک‌بار در فهرست سفارش وارد شود.",
  ),
});

function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

export async function GET() {
  return Response.json({ orders: database.orders });
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const result = orderSchema.safeParse(input);
  if (!result.success) {
    return Response.json(
      { message: "اطلاعات سفارش معتبر نیست.", errors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const orderItems: StoreOrder["items"] = [];
  for (const line of result.data.items) {
    const product = database.products.find((item) => item.id === line.productId);
    if (!product) {
      return Response.json({ message: "یکی از محصولات سفارش پیدا نشد." }, { status: 422 });
    }
    if (line.quantity > product.stock) {
      return Response.json({ message: `موجودی ${product.title} کافی نیست.` }, { status: 409 });
    }
    orderItems.push({
      productId: product.id,
      title: product.title,
      quantity: line.quantity,
      price: product.price,
    });
  }

  const order: StoreOrder = {
    ...result.data,
    id: createId("order"),
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
  };
  database.orders.unshift(order);
  for (const line of orderItems) {
    const product = database.products.find((item) => item.id === line.productId);
    if (product) product.stock -= line.quantity;
  }
  return Response.json({ order }, { status: 201 });
}
