import { z } from "zod";
import { createTrainingId, trainingDatabase } from "@/lib/training/mock-db";

const courseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().max(600).default(""),
  category: z.enum(["technician", "apprentice", "safety", "maintenance", "modernization"]),
  durationHours: z.number().int().min(1).max(500),
  sessionsCount: z.number().int().min(1).max(100),
  startDate: z.string(),
  endDate: z.string(),
  instructor: z.string().trim().min(2).max(80),
  location: z.string().trim().max(120).default(""),
  capacity: z.number().int().min(1).max(500),
  tuition: z.number().int().min(0),
  status: z.enum(["open", "upcoming", "closed"]),
});

export async function GET() {
  return Response.json({ courses: trainingDatabase.courses });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = courseSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: "اطلاعات دوره نامعتبر است.", errors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const course = {
    ...result.data,
    id: createTrainingId("course"),
    createdAt: new Date().toISOString(),
  };
  trainingDatabase.courses.unshift(course);
  return Response.json({ course }, { status: 201 });
}
