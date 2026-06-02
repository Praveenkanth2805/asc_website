import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { quoteStatusEmail } from "@/lib/email-templates";

export const GET = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quote);
});

export const PUT = withAdminAuth(async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const body = await req.json();
  const { status, ...rest } = body;

  // Fetch existing quote with lead info before update
  const existing = await prisma.quote.findUnique({
    where: { id },
    include: { lead: { select: { name: true } } },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update
  const updated = await prisma.quote.update({
    where: { id },
    data: { status, ...rest },
  });

  // If status changed to ACCEPTED or REJECTED, notify admin
  if ((status === "ACCEPTED" || status === "REJECTED") && existing.lead) {
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: `Quote ${status}`,
        html: quoteStatusEmail(updated, existing.lead.name, status),
      });
    } catch (error) {
      console.error("Failed to send quote status email:", error);
    }
  }

  return NextResponse.json(updated);
});