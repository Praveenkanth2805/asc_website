import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: { quotes: true, projects: true },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ lead, quotes: lead.quotes, projects: lead.projects });
});

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { status } = await req.json();
  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(lead);
});