import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { lead: true },
  });
  return NextResponse.json(project);
});

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { status, progressNote, expectedDelivery } = await req.json();
  const data: any = {};
  if (status) data.status = status;
  if (progressNote !== undefined) data.progressNote = progressNote;
  if (expectedDelivery) data.expectedDelivery = new Date(expectedDelivery);
  const project = await prisma.project.update({ where: { id: params.id }, data });
  return NextResponse.json(project);
});