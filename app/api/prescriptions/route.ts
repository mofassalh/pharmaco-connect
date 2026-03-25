import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const prescriptions = await prisma.prescription.findMany({
    include: {
      customer: true,
      medicines: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(prescriptions);
}