"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createCheckoutSession } from "@/lib/api";
import type { Plan } from "@/lib/api";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load payment script.")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Could not load the Razorpay payment script."));
    document.body.appendChild(script);
  });
}

export default function CheckoutView({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [processingPlan, setProcessingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectPlan = useCallback(
    async (plan: Plan) => {
      setShowSuccess(true);
      // Razorpay integration temporarily disabled for testing phase as requested.
      // Later on, uncomment the logic below to integrate Razorpay.
      
      /*
      setProcessingPlan(plan);
      setError(null);

      try {
        // 1. Fetch checkout session for selected plan
        const sessionPromise = createCheckoutSession({ tenantId, plan });
        // 2. Load razorpay script in parallel
        const scriptPromise = loadRazorpayScript();

        const session = await sessionPromise;
        await scriptPromise;

        if (!window.Razorpay) {
          throw new Error("Razorpay SDK failed to load");
        }

        const rzp = new window.Razorpay({
          key: session.keyId,
          amount: session.amount,
          currency: session.currency,
          name: "StartTambola",
          description: plan === "monthly" ? "Monthly Subscription" : "Yearly Subscription",
          order_id: session.orderId,
          theme: { color: "#ff3333" },

          handler(response: any) {
            const params = new URLSearchParams({
              tenantId: session.tenantId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              phone: session.ownerPhone,
            });
            router.push(`/register/confirmation?${params.toString()}`);
          },

          modal: {
            ondismiss() {
              setProcessingPlan(null);
            },
            confirm_close: true,
          },
        });

        rzp.open();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProcessingPlan(null);
      }
      */
    },
    [tenantId, router]
  );

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-6 w-full max-w-3xl rounded bg-red-500/10 border border-red-500 p-4 text-center text-red-500">
          {error}
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0f172a] p-8 border border-[#334155] text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16a34a]/20">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">Thank You!</h2>
            <p className="mb-6 text-gray-300 text-sm leading-relaxed">
              Thank you for choosing the plan. Our team will contact you soon.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="rounded bg-[#ff5e3a] px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#ff4520] shadow-lg"
            >
              Close
            </button>
          </div>
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
              className="w-full rounded bg-[#ff5e3a] hover:bg-[#ff4520] px-4 py-3 text-sm font-bold text-white transition-colors disabled:opacity-50"
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
              className="w-full rounded bg-[#ff5e3a] hover:bg-[#ff4520] px-4 py-3 text-sm font-bold text-white transition-colors disabled:opacity-50"
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
