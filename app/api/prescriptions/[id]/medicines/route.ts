import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const medicine = await prisma.prescriptionMedicine.create({
      data: {
        ...data,
        prescriptionId: id,
      },
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const medicines = await prisma.prescriptionMedicine.findMany({
      where: { prescriptionId: id },
    });
    return NextResponse.json(medicines);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}