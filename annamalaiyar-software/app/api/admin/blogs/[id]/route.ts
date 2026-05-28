import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validators";

export const GET = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const blog = await prisma.blog.findUnique({ where: { id: params.id } });
  return NextResponse.json(blog);
});

export const PUT = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json();
  const data = blogSchema.parse(body);
  const blog = await prisma.blog.update({ where: { id: params.id }, data });
  return NextResponse.json(blog);
});

export const DELETE = withAdminAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  await prisma.blog.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
});