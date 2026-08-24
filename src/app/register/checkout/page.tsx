import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Pricing & Checkout — StartTambola",
  description: "Select your subscription plan and complete your payment.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    tenantId?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    plan?: string;
  }>;
}) {
  const { tenantId, ownerName, ownerEmail, ownerPhone, plan } = await searchParams;

  if (!tenantId) {
    redirect("/register");
  }

  return (
    <>
      <NavBar />
      <main className="flex-1 bg-dark-bg py-16">
        <div className="mx-auto max-w-5xl px-6">
          <Suspense fallback={<div className="h-96" />}>
            <CheckoutView
              tenantId={tenantId}
              ownerName={ownerName ?? ""}
              ownerEmail={ownerEmail ?? ""}
              ownerPhone={ownerPhone ?? ""}
              plan={(plan === "monthly" ? "monthly" : "yearly") as "monthly" | "yearly"}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
