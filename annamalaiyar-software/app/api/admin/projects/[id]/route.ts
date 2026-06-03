import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { lead: true },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
});

export const PUT = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const { status, progressNote, expectedDelivery } = await req.json();

  const data: any = {};
  if (status !== undefined) data.status = status;
  if (progressNote !== undefined) data.progressNote = progressNote;
  if (expectedDelivery) data.expectedDelivery = new Date(expectedDelivery);

  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return NextResponse.json(project);
});