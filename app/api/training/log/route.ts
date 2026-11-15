import { trainingDatabase } from "@/lib/training/mock-db";

export async function GET() {
  return Response.json({ log: trainingDatabase.auditLog });
}
