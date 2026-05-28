import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validators";

export const GET = withAdminAuth(async () => {
  const projects = await prisma.project.findMany({
    include: { lead: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
});

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const data = projectSchema.parse(body);
  const project = await prisma.project.create({ data });
  return NextResponse.json(project);
});