import { z } from "zod";
import { trainingDatabase } from "@/lib/training/mock-db";

const patchSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().max(600).optional(),
  category: z
    .enum(["technician", "apprentice", "safety", "maintenance", "modernization"])
    .optional(),
  durationHours: z.number().int().min(1).max(500).optional(),
  sessionsCount: z.number().int().min(1).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  instructor: z.string().trim().min(2).max(80).optional(),
  location: z.string().trim().max(120).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  tuition: z.number().int().min(0).optional(),
  status: z.enum(["open", "upcoming", "closed"]).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const course = trainingDatabase.courses.find((c) => c.id === id);
  if (!course) return Response.json({ message: "دوره یافت نشد." }, { status: 404 });
  return Response.json({ course });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const course = trainingDatabase.courses.find((c) => c.id === id);
  if (!course) return Response.json({ message: "دوره یافت نشد." }, { status: 404 });

  const result = patchSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return Response.json({ message: "اطلاعات نامعتبر است." }, { status: 422 });
  }
  Object.assign(course, result.data);
  return Response.json({ course });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = trainingDatabase.courses.findIndex((c) => c.id === id);
  if (index === -1) return Response.json({ message: "دوره یافت نشد." }, { status: 404 });
  trainingDatabase.courses.splice(index, 1);
  return Response.json({ ok: true });
}
