"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCashfreeOrder } from "@/lib/api";
import type { Plan } from "@/lib/api";
import { PRICING } from "@/lib/pricing";
import { load } from "@cashfreepayments/cashfree-js";

interface CheckoutViewProps {
  tenantId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  defaultPlan: Plan;
  referralCode?: string;
}

export default function CheckoutView({
  tenantId,
  ownerName,
  ownerEmail,
  ownerPhone,
  defaultPlan,
  referralCode,
}: CheckoutViewProps) {
  const router = useRouter();
  const [processingPlan, setProcessingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = useCallback(
    async (selectedPlan: Plan) => {
      setProcessingPlan(selectedPlan);
      setError(null);

      try {
        const orderData = await createCashfreeOrder({
          tenantId,
          plan: selectedPlan,
          ownerName,
          ownerEmail,
          ownerPhone,
          referralCode,
        });

        const cashfree = await load({ mode: "production" });
        if (!cashfree) {
          throw new Error("Cashfree SDK failed to load");
        }
        await cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: "_modal",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initiate payment. Please try again.",
        );
        setProcessingPlan(null);
      }
    },
    [tenantId, ownerName, ownerEmail, ownerPhone, referralCode],
  );

  const monthlyPrice = referralCode ? PRICING.monthlyReferral : PRICING.monthlyLaunch;

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-6 w-full max-w-3xl rounded bg-red-500/10 border border-red-500 p-4 text-center text-red-500">
          {error}
        </div>
      )}

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Monthly Card */}
        <div className="flex flex-col rounded-xl bg-white/5 border border-white/5 p-6 shadow-2xl relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff5e3a] px-4 py-1 text-xs font-bold text-white">
            🔥 New Launch Offer
          </span>

          <h3 className="text-center text-xl font-bold text-[#ff9d4a] mb-6">Monthly basis</h3>

          <div className="space-y-4 mb-8">
            <div className="w-full rounded bg-white/5 px-4 py-3 border border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-500 line-through">₹{PRICING.monthlyRegular.toLocaleString()}/month</span>
              <span className="text-base font-bold text-[#ff9d4a]">₹{monthlyPrice.toLocaleString()}/month</span>
            </div>
            
            {referralCode && (
              <div className="w-full rounded bg-green-500/10 px-4 py-3 border border-green-500/20 flex flex-col items-center justify-center">
                <span className="text-sm font-semibold text-green-400">🏷️ Referral applied: -₹{PRICING.referralDiscount}</span>
              </div>
            )}
            
            <div className="w-full rounded bg-white/5 px-4 py-3 border border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total cost for first month:</span>
              <span className="text-sm font-semibold text-[#ff9d4a]">₹{monthlyPrice.toLocaleString()}</span>
            </div>
            
            <p className="text-center text-xs text-gray-500 italic">
              Renews at ₹{PRICING.monthlyRegular.toLocaleString()}/month thereafter
            </p>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => handleSelectPlan("monthly")}
              disabled={processingPlan !== null}
              className="w-full rounded bg-[#ff5e3a] hover:bg-[#ff4520] px-4 py-3 text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPlan === "monthly" ? "PROCESSING..." : "SELECT THIS"}
            </button>
          </div>
        </div>

        {/* Yearly Card */}
        <div className="flex flex-col rounded-xl bg-white/5 border border-white/5 p-6 shadow-2xl">
          <h3 className="text-center text-xl font-bold text-[#ff9d4a] mb-6">Yearly basis</h3>

          <div className="space-y-4 mb-8">
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10 flex justify-between">
              <span>Monthly equivalent</span>
              <span>₹{PRICING.yearlyMonthly.toLocaleString()}/month</span>
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10 flex justify-between">
              <span>Cost for 12 months</span>
              <span>₹{PRICING.yearlyTotal.toLocaleString()}</span>
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10 flex justify-between font-semibold">
              <span>Total cost</span>
              <span className="text-[#ff9d4a]">₹{PRICING.yearlyTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => handleSelectPlan("yearly")}
              disabled={processingPlan !== null}
              className="w-full rounded bg-[#ff5e3a] hover:bg-[#ff4520] px-4 py-3 text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingPlan === "yearly" ? "PROCESSING..." : "SELECT THIS"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl rounded-lg bg-white/5 border border-white/5 border-l-4 border-l-[#ff5e3a] p-5">
        <p className="text-sm text-gray-400">
          <span className="font-bold text-[#ff9d4a]">Note:</span> Payment is for subscription plan. 1 month = 30 days, where 1 day = 24 hours. Please{" "}
          <Link href="/refund-policy" className="text-[#ff5e3a] hover:underline">
            read refund policy
          </Link>{" "}
          before purchasing.
        </p>
      </div>
    </div>
  );
}
