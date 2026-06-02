import { NextRequest, NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { quoteSchema } from "@/lib/validators";
import { sendEmail } from "@/lib/email";
import { quoteEmail } from "@/lib/email-templates";

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

  // 1. Create the quote
  const quote = await prisma.quote.create({ data });

  // 2. Fetch lead details
  const lead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { id: true, name: true, email: true, status: true },
  });

  // 3. Auto‑update lead status to QUOTE_SENT if currently before that stage
  if (lead) {
    const statusOrder = [
      "NEW", "CONTACTED", "IN_DISCUSSION", "QUOTE_SENT",
      "ACCEPTED", "REJECTED", "PROJECT_STARTED", "WAITING_CLIENT",
      "IN_PROGRESS", "COMPLETED", "DELIVERED"
    ];
    const currentIdx = statusOrder.indexOf(lead.status);
    const quoteSentIdx = statusOrder.indexOf("QUOTE_SENT");
    if (currentIdx < quoteSentIdx) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: "QUOTE_SENT" },
      });
    }
  }

  // 4. Send email to client with Accept button and changes note
  if (lead?.email) {
    try {
      await sendEmail({
        to: lead.email,
        subject: "Your Quote from Annamalaiyar Software Centre",
        html: quoteEmail(
          data.serviceName,
          data.price,
          data.description,
          data.deliveryTime,
          quote.id
        ),
      });
    } catch (error) {
      console.error("Failed to send quote email to client:", error);
    }

    // 5. Notify admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: `Quote sent to ${lead.name}`,
        html: `<p>A quote for <strong>${data.serviceName}</strong> (₹${data.price}) was sent to ${lead.name} (${lead.email}).</p>`,
      });
    } catch (error) {
      console.error("Failed to send admin notification:", error);
    }
  }

  return NextResponse.json(quote);
});