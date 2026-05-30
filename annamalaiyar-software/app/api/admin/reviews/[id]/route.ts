import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const PUT = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const { approved } = await req.json();
  const review = await prisma.review.update({ where: { id }, data: { approved } });
  return NextResponse.json(review);
});

export const DELETE = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
});