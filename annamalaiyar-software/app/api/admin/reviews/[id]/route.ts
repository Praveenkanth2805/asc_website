import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { approved } = await req.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { approved },
  });
  return NextResponse.json(review);
});

export const DELETE = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
});