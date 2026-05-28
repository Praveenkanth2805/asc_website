import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/validators";

export const GET = withAdminAuth(async () => {
  const items = await prisma.portfolio.findMany();
  return NextResponse.json(items);
});

export const POST = withAdminAuth(async (req: NextRequest) => {
  const body = await req.json();
  const data = portfolioSchema.parse(body);
  const item = await prisma.portfolio.create({ data });
  return NextResponse.json(item);
});