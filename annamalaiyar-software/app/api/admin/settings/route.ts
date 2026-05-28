import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export const GET = withAdminAuth(async () => {
  const settings = await prisma.setting.findMany();
  return NextResponse.json(settings);
});

export const PUT = withAdminAuth(async (req: NextRequest) => {
  const { key, value } = await req.json();
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json(setting);
});