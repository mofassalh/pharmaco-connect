import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json([], { status: 200 });

    const { payload } = await jwtVerify(token, secret);
    const { searchParams } = new URL(req.url);
    const myOrders = searchParams.get("my");

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { customer: true },
    });

    if (myOrders && user?.customer) {
      const orders = await prisma.order.findMany({
        where: { customerId: user.customer.id },
        include: { items: true, payments: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: { include: { user: true } },
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
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Login করুন" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { customer: true },
    });

    if (!user?.customer) return NextResponse.json({ error: "Customer পাওয়া যায়নি" }, { status: 404 });

    const body = await req.json();
    const { items, totalAmount, deliveryAddress, deliveryArea, deliveryNotes, orderType, paymentMethod } = body;

    const order = await prisma.order.create({
      data: {
        customerId: user.customer.id,
        orderType: orderType || "REGULAR",
        totalAmount,
        dueAmount: totalAmount,
        deliveryAddress,
        deliveryArea,
        deliveryNotes,
        items: {
          create: items.map((item: any) => ({
            inventoryItemId: item.inventoryItemId,
            medicineName: item.medicineName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: { items: true },
    });

    // Payment record তৈরি করুন
    if (paymentMethod) {
      await prisma.payment.create({
        data: {
          customerId: user.customer.id,
          orderId: order.id,
          amount: totalAmount,
          method: paymentMethod,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}