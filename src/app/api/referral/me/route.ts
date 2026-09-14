import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyReferrerJwt } from "@/lib/referral";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gt_referrer_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyReferrerJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Internal key missing" }, { status: 500 });
    }

    // Call backend to get dashboard stats
    const res = await fetch(`${BASE_URL}/referrers/${payload.referrerId}/dashboard`, {
      method: "GET",
      headers: {
        "x-internal-key": apiKey,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard me route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
