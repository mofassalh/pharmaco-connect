import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Login করুন" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);

    const customer = await prisma.customer.findFirst({
      where: { userId: payload.userId as string },
    });

    if (!customer) return NextResponse.json({ error: "Customer পাওয়া যায়নি" }, { status: 404 });

    const { orderId, amount, method, transactionId, senderNumber } = await req.json();

    if (!orderId || !amount || !method || !transactionId) {
      return NextResponse.json({ error: "সব তথ্য দিন" }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        customerId: customer.id,
        amount: parseFloat(amount),
        method,
        status: "PENDING",
        transactionId,
        notes: senderNumber ? `Sender: ${senderNumber}` : null,
      },
    });

    return NextResponse.json(payment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Login করুন" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);

    const customer = await prisma.customer.findFirst({
      where: { userId: payload.userId as string },
      include: {
        orders: {
          where: { dueAmount: { gt: 0 } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) return NextResponse.json({ error: "Customer পাওয়া যায়নি" }, { status: 404 });

    return NextResponse.json({
      orders: customer.orders,
      totalDue: customer.orders.reduce((sum, o) => sum + Number(o.dueAmount), 0),
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
