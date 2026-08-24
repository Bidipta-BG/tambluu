"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createCashfreeOrder } from "@/lib/api";
import type { Plan } from "@/lib/api";

interface CheckoutViewProps {
  tenantId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  plan: Plan;
}

export default function CheckoutView({
  tenantId,
  ownerName,
  ownerEmail,
  ownerPhone,
  plan: initialPlan,
}: CheckoutViewProps) {
  const [processingPlan, setProcessingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = useCallback(
    async (selectedPlan: Plan) => {
      setProcessingPlan(selectedPlan);
      setError(null);

      try {
        // Step 1: Create Cashfree order via server-side Route Handler.
        // The secret key never leaves the server.
        const { paymentSessionId } = await createCashfreeOrder({
          tenantId,
          plan: selectedPlan,
          ownerName,
          ownerEmail,
          ownerPhone,
        });

        // Step 2: Dynamically load the Cashfree JS SDK (browser-only, loaded on demand).
        const { load } = await import("@cashfreepayments/cashfree-js");
        const cashfree = await load({ mode: "production" });

        if (!cashfree) {
          throw new Error(
            "Cashfree SDK failed to load. Please check your internet connection and try again.",
          );
        }

        // Step 3: Open the Cashfree checkout in a modal popup.
        // cashfree.checkout() returns a Promise that resolves when the
        // modal is closed (either after payment or by the user).
        await cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_modal",
        });

        // After the modal closes, Cashfree will redirect to the return_url
        // (configured in the create-order Route Handler) if payment succeeded.
        // No additional action needed here — the redirect handles navigation.
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
        setProcessingPlan(null);
      }
    },
    [tenantId, ownerName, ownerEmail, ownerPhone],
  );

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-6 w-full max-w-3xl rounded bg-red-500/10 border border-red-500 p-4 text-center text-red-500">
          {error}
        </div>
      )}

      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Monthly Card */}
        <div className="flex flex-col rounded-xl bg-white/5 border border-white/5 p-6 shadow-2xl">
          <h3 className="text-center text-xl font-bold text-[#ff9d4a] mb-6">Monthly basis</h3>

          <div className="space-y-4 mb-8">
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              4,500₹/month
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              Cost for 1 month: 4,500₹
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              Total cost: 4,500₹
            </div>
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
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              2,600₹/month
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              Cost for 12 months: 31,200₹
            </div>
            <div className="w-full rounded bg-white/5 px-4 py-3 text-sm text-gray-300 border border-white/10">
              Total cost: 31,200₹
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
