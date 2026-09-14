import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false, error: "Code is required" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/referrers/by-code/${encodeURIComponent(code)}`, {
      method: "GET",
    });

    if (!res.ok) {
      return NextResponse.json({ valid: false });
    }

    const data = await res.json();
    return NextResponse.json({
      valid: data.data?.valid ?? false,
      referrerFirstName: data.data?.referrerFirstName,
    });
  } catch (error) {
    console.error("Validate code error:", error);
    return NextResponse.json({ valid: false, error: "Internal server error" }, { status: 500 });
  }
}
