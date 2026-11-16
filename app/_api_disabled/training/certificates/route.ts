import { z } from "zod";
import { createTrainingId, generateSerial, logAudit, trainingDatabase } from "@/lib/training/mock-db";

const issueSchema = z.object({
  students: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(80),
        nationalId: z.string().trim().max(20).default(""),
      }),
    )
    .min(1)
    .max(200),
  courseId: z.string(),
  grade: z.string().trim().max(40).default("قبول"),
  issueDate: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const courseId = searchParams.get("courseId") ?? "";
  const status = searchParams.get("status") ?? "";

  let certificates = trainingDatabase.certificates;
  if (courseId) certificates = certificates.filter((c) => c.courseId === courseId);
  if (status === "valid" || status === "revoked")
    certificates = certificates.filter((c) => c.status === status);
  if (query) {
    certificates = certificates.filter(
      (c) =>
        c.studentName.toLowerCase().includes(query) ||
        c.serial.toLowerCase().includes(query) ||
        c.courseTitle.toLowerCase().includes(query),
    );
  }
  return Response.json({ certificates });
}

export async function POST(request: Request) {
  const result = issueSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return Response.json(
      { message: "اطلاعات دانشجو نامعتبر است.", errors: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const course = trainingDatabase.courses.find((c) => c.id === result.data.courseId);
  if (!course) {
    return Response.json({ message: "دوره انتخابی یافت نشد." }, { status: 404 });
  }

  const issueDate = result.data.issueDate ?? new Date().toISOString();
  const issued = result.data.students.map((student) => {
    const certificate = {
      id: createTrainingId("cert"),
      serial: generateSerial(),
      studentName: student.name,
      nationalId: student.nationalId,
      courseId: course.id,
      courseTitle: course.title,
      durationHours: course.durationHours,
      issueDate,
      completionDate: course.endDate,
      grade: result.data.grade,
      status: "valid" as const,
      revokedAt: null,
      revokeReason: null,
      createdAt: new Date().toISOString(),
    };
    trainingDatabase.certificates.unshift(certificate);
    logAudit({
      action: "created",
      certificateId: certificate.id,
      serial: certificate.serial,
      detail: `صدور گواهینامه برای ${student.name} — دوره ${course.title}`,
    });
    return certificate;
  });

  return Response.json({ certificates: issued }, { status: 201 });
}
