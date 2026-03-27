import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        customer: true,
        medicines: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const prescription = await prisma.prescription.create({
      data,
      include: { medicines: true },
    });
    return NextResponse.json(prescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}