import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Login করুন" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { customer: true, adminProfile: true },
    });

    if (!user) return NextResponse.json({ error: "User পাওয়া যায়নি" }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      name: user.customer?.fullName || user.adminProfile?.fullName,
      address: user.customer?.address,
      area: user.customer?.area,
      city: user.customer?.city,
      photoUrl: user.customer?.photoUrl || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.json({ error: "Login করুন" }, { status: 401 });

    const { payload } = await jwtVerify(token, secret);
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { customer: true },
    });

    if (!user || !user.customer) return NextResponse.json({ error: "User পাওয়া যায়নি" }, { status: 404 });

    await prisma.customer.update({
      where: { id: user.customer.id },
      data: {
        fullName: body.fullName || user.customer.fullName,
        address: body.address ?? user.customer.address,
        area: body.area ?? user.customer.area,
        city: body.city ?? user.customer.city,
        ...(body.photoUrl && { photoUrl: body.photoUrl }),
      },
    });

    if (body.phone) {
      await prisma.user.update({
        where: { id: payload.userId as string },
        data: { phone: body.phone },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "কিছু একটা ভুল হয়েছে" }, { status: 500 });
  }
}