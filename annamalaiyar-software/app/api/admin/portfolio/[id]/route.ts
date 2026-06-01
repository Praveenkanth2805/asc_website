import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validators";

export const GET = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const item = await prisma.portfolio.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
});

export const PUT = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const body = await req.json();
  const data = portfolioSchema.parse(body);
  const item = await prisma.portfolio.update({ where: { id }, data });
  return NextResponse.json(item);
});

export const DELETE = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  await prisma.portfolio.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
});