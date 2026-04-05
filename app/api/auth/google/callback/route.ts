import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=google_denied`
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=token_failed`
      );
    }

    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );

    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=no_email`
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          passwordHash: "",
          googleId: googleUser.id,
          avatar: googleUser.picture || null,
          role: "CUSTOMER",
        },
      });

      await prisma.customer.create({
        data: {
          userId: user.id,
          fullName: googleUser.name || googleUser.email.split("@")[0],
          photoUrl: googleUser.picture || null,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { email: googleUser.email },
        data: {
          googleId: googleUser.id,
          avatar: googleUser.picture || null,
        },
      });
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/customer/dashboard`
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=server_error`
    );
  }
}
