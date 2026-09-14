import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("gt_referrer_session");
  // Alternatively, set maxAge to 0
  response.cookies.set("gt_referrer_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/refer",
    maxAge: 0,
  });
  return response;
}
