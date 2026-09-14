import { NextResponse } from "next/server";
import { generateReferralCode } from "@/lib/referral";

// Example endpoint URL - this will hit the existing backend base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, mobile, password } = body;

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Internal key missing" }, { status: 500 });
    }

    // Call the backend to create the referrer account
    const res = await fetch(`${BASE_URL}/referrers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": apiKey,
      },
      body: JSON.stringify({ name, email, mobile, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      let errorMsg = `Backend returned ${res.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMsg = errorData.error ?? errorData.message ?? errorMsg;
      } catch (e) {
        if (res.status === 404) {
          errorMsg = "Backend endpoint POST /referrers not implemented yet (404).";
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
    
    // We expect the backend to return { data: { referrerId, referralCode } }
    const referralCode = data.data?.referralCode;
    const referrerId = data.data?.referrerId;

    return NextResponse.json({
      referrerId,
      referralCode,
      // We can generate the link here for convenience, though frontend can too
      referralLink: `https://gettambola.in/register?ref=${referralCode}`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
