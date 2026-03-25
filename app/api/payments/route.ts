import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: {
      customer: true,
      order: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const payment = await prisma.payment.create({ data });

  // Update order paidAmount and dueAmount
  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
  });

  if (order) {
    const newPaid = Number(order.paidAmount) + Number(data.amount);
    const newDue = Number(order.totalAmount) - newPaid;

    await prisma.order.update({
      where: { id: data.orderId },
      data: {
        paidAmount: newPaid,
        dueAmount: Math.max(0, newDue),
      },
    });
  }

  return NextResponse.json(payment);
}