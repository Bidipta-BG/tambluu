import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyReferrerJwt } from "@/lib/referral";
import ReferralDashboard from "@/components/referral/ReferralDashboard";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gt_referrer_session")?.value;

  if (!token) {
    redirect("/refer/login");
  }

  const payload = verifyReferrerJwt(token);
  if (!payload) {
    redirect("/refer/login");
  }

  // Fetch dashboard data server-side
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

  if (!apiKey) {
    throw new Error("Internal API key missing");
  }

  const res = await fetch(`${BASE_URL}/referrers/${payload.referrerId}/dashboard`, {
    headers: {
      "x-internal-key": apiKey,
    },
    // Don't cache dashboard data
    cache: "no-store",
  });

  if (!res.ok) {
    // If the server returns 401 or 404, we should probably force re-login
    if (res.status === 401 || res.status === 404) {
      redirect("/refer/login");
    }
    throw new Error("Failed to load dashboard data");
  }

  const data = await res.json();
  const dashboardData = data.data ?? data;

  return (
    <div className="flex-1 bg-[#f4f7f6]">
      <ReferralDashboard data={dashboardData} />
    </div>
  );
}
