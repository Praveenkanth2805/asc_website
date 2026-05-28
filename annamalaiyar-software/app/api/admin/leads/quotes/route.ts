import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validators";

export const GET = withAdminAuth(async () => {
  const quotes = await prisma.quote.findMany({
    include: { lead: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
});

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const data = quoteSchema.parse(body);
  const quote = await prisma.quote.create({ data });
  return NextResponse.json(quote);
});