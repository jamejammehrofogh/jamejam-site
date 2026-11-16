import { z } from "zod";
import { database } from "@/lib/mock-db";

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "proposal_sent", "closed"]),
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

  const result = statusSchema.safeParse(input);
  if (!result.success) {
    return Response.json({ message: "وضعیت انتخاب‌شده معتبر نیست." }, { status: 422 });
  }

  const { id } = await params;
  const lead = database.leads.find((item) => item.id === id);
  if (!lead) return Response.json({ message: "درخواست پیدا نشد." }, { status: 404 });

  lead.status = result.data.status;
  return Response.json({ lead });
}
