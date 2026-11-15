import { cookies } from "next/headers";
import { z } from "zod";
import {
  SESSION_COOKIE,
  createSession,
  destroySession,
  findStudentByIdentifier,
  getStudentSession,
} from "@/lib/training/students";

const loginSchema = z.object({
  identifier: z.string().trim().min(4).max(20),
});

export async function POST(request: Request) {
  const result = loginSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) {
    return Response.json(
      { message: "شماره موبایل یا کد ملی را وارد کنید." },
      { status: 422 },
    );
  }

  const student = findStudentByIdentifier(result.data.identifier);
  if (!student) {
    return Response.json(
      {
        message:
          "حسابی با این شماره موبایل / کد ملی یافت نشد. با واحد آموزش تماس بگیرید.",
      },
      { status: 401 },
    );
  }
  if (student.status === "suspended") {
    return Response.json(
      { message: "حساب شما به‌صورت موقت غیرفعال است. با مدیریت آموزش تماس بگیرید." },
      { status: 403 },
    );
  }

  const token = createSession(student.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const session = getStudentSession(student);
  return Response.json({
    student: session.student,
    coursesCount: session.courses.length,
    certificatesCount: session.certificates.length,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  destroySession(cookieStore.get(SESSION_COOKIE)?.value);
  cookieStore.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
