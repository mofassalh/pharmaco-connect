import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json([], { status: 200 });
    }

    const { payload } = await jwtVerify(token, secret);

    const customer = await prisma.customer.findFirst({
      where: { userId: payload.userId as string },
    });

    if (!customer) {
      return NextResponse.json([], { status: 200 });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { customerId: customer.id },
      include: { medicines: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}