import { z } from "zod";
import { createId, database, type QuoteLead } from "@/lib/mock-db";

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().transform(toLatinDigits).pipe(z.string().regex(/^0912\d{7}$/)),
  service: z.enum(["installation", "maintenance", "repair", "parts"]),
  buildingType: z.enum(["residential", "commercial", "industrial"]),
  stops: z.number().int().min(1).max(100),
  capacity: z.string().max(20).optional(),
  details: z.string().trim().max(500).optional(),
});

function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return Response.json({ message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const result = quoteSchema.safeParse(input);
  if (!result.success) {
    return Response.json(
      { message: "اطلاعات واردشده معتبر نیست.", errors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const lead: QuoteLead = {
    ...result.data,
    id: createId("lead"),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  database.leads.unshift(lead);
  return Response.json({ lead }, { status: 201 });
}

export async function GET() {
  return Response.json({ leads: database.leads });
}
