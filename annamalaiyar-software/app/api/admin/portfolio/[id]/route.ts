import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validators";

export const GET = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const item = await prisma.portfolio.findUnique({ where: { id: params.id } });
  return NextResponse.json(item);
});

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json();
  const data = portfolioSchema.parse(body);
  const item = await prisma.portfolio.update({ where: { id: params.id }, data });
  return NextResponse.json(item);
});

export const DELETE = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await prisma.portfolio.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
});