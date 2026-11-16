import { z } from "zod";
import { logAudit, trainingDatabase } from "@/lib/training/mock-db";

const patchSchema = z.object({
  studentName: z.string().trim().min(2).max(80).optional(),
  nationalId: z.string().trim().max(20).optional(),
  grade: z.string().trim().max(40).optional(),
  issueDate: z.string().optional(),
  completionDate: z.string().optional(),
  action: z.enum(["revoke", "restore"]).optional(),
  revokeReason: z.string().trim().max(300).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const certificate =
    trainingDatabase.certificates.find((c) => c.id === id) ??
    trainingDatabase.certificates.find((c) => c.serial === id);
  if (!certificate) return Response.json({ message: "گواهینامه یافت نشد." }, { status: 404 });
  return Response.json({ certificate });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const certificate =
    trainingDatabase.certificates.find((c) => c.id === id) ??
    trainingDatabase.certificates.find((c) => c.serial === id);
  if (!certificate) return Response.json({ message: "گواهینامه یافت نشد." }, { status: 404 });

  const result = patchSchema.safeParse(await request.json().catch(() => null));
  if (!result.success) return Response.json({ message: "اطلاعات نامعتبر است." }, { status: 422 });

  const { action, revokeReason, ...fields } = result.data;

  if (action === "revoke") {
    certificate.status = "revoked";
    certificate.revokedAt = new Date().toISOString();
    certificate.revokeReason = revokeReason ?? "ابطال توسط واحد آموزش شرکت جام جم.";
    logAudit({
      action: "revoked",
      certificateId: certificate.id,
      serial: certificate.serial,
      detail: `ابطال گواهینامه ${certificate.studentName} — ${certificate.revokeReason}`,
    });
  } else if (action === "restore") {
    certificate.status = "valid";
    certificate.revokedAt = null;
    certificate.revokeReason = null;
    logAudit({
      action: "restored",
      certificateId: certificate.id,
      serial: certificate.serial,
      detail: `رفع ابطال گواهینامه ${certificate.studentName}`,
    });
  }

  Object.assign(certificate, fields);
  if (!action) {
    logAudit({
      action: "updated",
      certificateId: certificate.id,
      serial: certificate.serial,
      detail: `ویرایش گواهینامه ${certificate.studentName}`,
    });
  }

  return Response.json({ certificate });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const index = trainingDatabase.certificates.findIndex((c) => c.id === id || c.serial === id);
  if (index === -1) return Response.json({ message: "گواهینامه یافت نشد." }, { status: 404 });
  const [removed] = trainingDatabase.certificates.splice(index, 1);
  logAudit({
    action: "updated",
    certificateId: removed.id,
    serial: removed.serial,
    detail: `حذف گواهینامه ${removed.studentName}`,
  });
  return Response.json({ ok: true });
}
