import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async () => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { quotes: true, projects: true },
  });
  return NextResponse.json(leads);
});