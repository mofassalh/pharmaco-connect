import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "pharmaco-secret-key-2026"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Customer pages protect
  if (pathname.startsWith("/customer")) {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Admin pages protect — login page বাদ দিয়ে
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as string;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "DELIVERY_STAFF") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/admin/:path*",
  ],
};