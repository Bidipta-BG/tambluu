"use client";

import { useRouter } from "next/navigation";
import ReferralCodeBox from "./ReferralCodeBox";
import ReferralProgress from "./ReferralProgress";
import ReferralHistoryTable from "./ReferralHistoryTable";
import PendingActivationScreen from "./PendingActivationScreen";

export default function ReferralDashboard({ data }: { data: any }) {
  const router = useRouter();
  const { referrer, stats, referrals } = data;

  async function handleLogout() {
    await fetch("/api/referral/logout", { method: "POST" });
    router.push("/refer/login");
  }

  if (!referrer.isActive) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex justify-end mb-8">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
        <PendingActivationScreen />
      </div>
    );
  }

  const totalReferrals = referrals?.length || 0;
  const successfulReferrals = referrals?.filter((r: any) => r.status === 'successful').length || 0;
  const pendingReferrals = referrals?.filter((r: any) => r.status === 'pending').length || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {referrer.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ReferralCodeBox code={referrer.referralCode} />
          
          {/* Quick Stats Strip */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Overview</h3>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Referrals</span>
                <span className="font-bold text-gray-900">{totalReferrals}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Successful</span>
                <span className="font-bold text-green-600">{successfulReferrals}</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Pending</span>
                <span className="font-bold text-orange-500">{pendingReferrals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Progress & History */}
        <div className="lg:col-span-2 space-y-8">
          <ReferralProgress stats={stats} />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Referral History</h3>
            </div>
            <ReferralHistoryTable referrals={referrals} />
          </div>
        </div>
      </div>
    </div>
  );
}
