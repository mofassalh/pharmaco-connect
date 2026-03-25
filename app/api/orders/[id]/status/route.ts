import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status, changedBy, note } = await req.json();

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: params.id,
      status,
      changedBy,
      note,
    },
  });

  return NextResponse.json(order);
}


