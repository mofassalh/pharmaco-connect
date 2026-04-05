import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const item = await prisma.inventoryItem.update({
    where: { id },
    data,
  });

  return NextResponse.json(item);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const item = await prisma.inventoryItem.findUnique({
    where: { id },
  });

  return NextResponse.json(item);
}
