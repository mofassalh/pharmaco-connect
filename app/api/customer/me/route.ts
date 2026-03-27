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
      return NextResponse.json({ error: "Login করুন" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, secret);

    const customer = await prisma.customer.findFirst({
      where: { userId: payload.id as string },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
