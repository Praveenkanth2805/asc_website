import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { status } = await req.json();
  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(quote);
});