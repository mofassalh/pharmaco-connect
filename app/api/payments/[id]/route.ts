import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const payment = await prisma.payment.update({
    where: { id },
    data,
  });

  return NextResponse.json(payment);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { customer: true, order: true },
  });

  return NextResponse.json(payment);
}
