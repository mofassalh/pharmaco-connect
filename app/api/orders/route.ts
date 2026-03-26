import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const due = searchParams.get("due");

    const orders = await prisma.order.findMany({
      where: due ? { dueAmount: { gt: 0 } } : {},
      include: {
        customer: {
          include: { user: true },
        },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const order = await prisma.order.create({
      data,
      include: { customer: true, items: true },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}