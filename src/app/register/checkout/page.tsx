import { redirect } from "next/navigation";
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import CheckoutView from "@/components/CheckoutView";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    tenantId?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    plan?: string;
    referralCode?: string;
  }>;
}) {
  const { tenantId, ownerName, ownerEmail, ownerPhone, plan, referralCode } = await searchParams;

  if (!tenantId || typeof tenantId !== "string") {
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
              ownerName={typeof ownerName === "string" ? ownerName : ""}
              ownerEmail={typeof ownerEmail === "string" ? ownerEmail : ""}
              ownerPhone={typeof ownerPhone === "string" ? ownerPhone : ""}
              plan={(plan === "monthly" ? "monthly" : "yearly") as "monthly" | "yearly"}
              referralCode={typeof referralCode === "string" ? referralCode : undefined}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}
