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

  // 1. Create the quote in database
  const quote = await prisma.quote.create({ data });

  // 2. Fetch the lead's name and email
  const lead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { name: true, email: true },
  });

  // 3. Send email to the client (if we have an email)
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

    // 4. Send notification to admin
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