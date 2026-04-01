import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Customer pages protect
  if (pathname.startsWith("/customer")) {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Token আছে মানে logged in — role check API তে হবে
    return NextResponse.next();
  }

  // Admin pages protect
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/admin/:path*",
  ],
};