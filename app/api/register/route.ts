import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "সব তথ্য দিন" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "এই email দিয়ে আগেই account আছে" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
        customer: {
          create: { fullName },
        },
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "কিছু একটা ভুল হয়েছে" }, { status: 500 });
  }
}