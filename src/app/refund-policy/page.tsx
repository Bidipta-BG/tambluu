import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Refund Policy — StartTambola",
  description: "Read our refund policy for StartTambola services.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-black py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-3xl font-bold text-red-500 mb-8">
            Refund Policy
          </h1>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-10">
            At <strong className="text-white font-semibold">StartTambola.com</strong>, we provide a self-service platform for creating your own Tambola hosting websites with custom .com domains. Please read our refund policy carefully before purchasing.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                1. Payment Handling and Responsibility
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                All transactions are processed via Razorpay. If money is deducted from your UPI app or bank but not reflected on our system, we are not responsible. The issue lies with Razorpay or your bank.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                2. Refund Timing and Processing
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                All valid refunds are processed only via Razorpay and take 5 to 7 business days. We do not refund via personal QR codes or direct transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                3. No Refunds for Change of Mind
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Refunds will not be provided for change of mind, misunderstanding of the product, or casual use. The purchase is for a real hosting service with non-refundable cost. Please watch the demo video before buying.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                4. Valid Refund Reasons
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Refunds are only considered for unfixable technical issues from our side. If the problem persists and cannot be resolved within 5-7 business days, a refund may be issued.
              </p>
            </section>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
