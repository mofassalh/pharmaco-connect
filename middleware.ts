import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const adminToken = req.cookies.get("admin_token")?.value;
  const customerToken = req.cookies.get("customer_token")?.value;

  // Admin routes protect
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Customer routes protect
  if (pathname.startsWith("/customer") && pathname !== "/customer/login") {
    if (!customerToken) {
      return NextResponse.redirect(new URL("/customer/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};