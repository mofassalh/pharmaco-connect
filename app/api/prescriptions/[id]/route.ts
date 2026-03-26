import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        medicines: true,
        customer: true,
      },
    });
    if (!prescription) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const prescription = await prisma.prescription.update({
      where: { id },
      data,
    });
    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}