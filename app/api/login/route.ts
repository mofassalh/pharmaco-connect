import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email ও Password দিন" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { customer: true, adminProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Email বা Password ভুল" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Email বা Password ভুল" }, { status: 401 });
    }

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.customer?.fullName || user.adminProfile?.fullName || user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.customer?.fullName || user.email,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "কিছু একটা ভুল হয়েছে" }, { status: 500 });
  }
}