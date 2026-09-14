import { NextResponse } from "next/server";
import { signReferrerJwt } from "@/lib/referral";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // Call the backend to authenticate
    const res = await fetch(`${BASE_URL}/referrers/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      let errorMsg = `Backend returned ${res.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMsg = errorData.error?.message ?? errorData.error ?? errorData.message ?? errorMsg;
      } catch (e) {
        if (res.status === 404) {
          errorMsg = "Backend endpoint POST /referrers/auth not implemented yet (404).";
        } else {
          errorMsg = `${errorMsg}: ${text.slice(0, 100)}`;
        }
      }
      return NextResponse.json(
        { error: errorMsg },
        { status: res.status }
      );
    }

    const data = await res.json();
    // We expect { data: { referrerId, name, isActive } }
    const referrerId = data.data?.referrerId;
    const isActive = data.data?.isActive;

    if (!referrerId) {
      return NextResponse.json({ error: "Invalid response from server" }, { status: 500 });
    }

    // Generate JWT
    const token = signReferrerJwt(referrerId);

    // Set HttpOnly cookie
    const response = NextResponse.json({ isActive });
    response.cookies.set("gt_referrer_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/refer",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
