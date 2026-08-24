import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Service Policy — StartTambola",
  description: "Read the terms of service and service policy for StartTambola.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-black py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-3xl font-bold text-red-500 mb-8">
            Service Policy
          </h1>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-10">
            starttambola.in is a <strong className="text-white font-semibold">self-service platform</strong> designed for public use. It is <strong className="text-white font-semibold">not a custom or personal development agency</strong>. The platform provides the same service and features to all users equally, and does not cater to individual customization, deployment requests, or technical development.
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                1. Platform Nature and Hosting
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                We utilize <strong className="text-white font-semibold">Vercel</strong> as our web hosting provider. As such, any unexpected service disruption, downtime, or crash may occur due to standard hosting behavior and should be considered <strong className="text-white font-semibold">normal and beyond our direct control</strong>.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Such interruptions are natural in the technology landscape and are not caused deliberately. Downtime can happen during peak hours, server issues, or even hosting-level maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                2. Equal and Shared Usage
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every user accesses starttambola.in through the same backend systems. This shared model ensures fairness, but it also means that one user's experience is not technically separated from another. Issues that arise typically affect all users equally and cannot be attributed to specific user accounts or actions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                3. Legal Responsibility and Misunderstanding
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                <strong className="text-white font-semibold">Clients must not accuse or sue starttambola.in</strong> for hosting or performance-related incidents unless there is conclusive proof of intentional negligence. We emphasize that this platform is not a custom product tailored to individual needs. It is a generalized solution used by thousands.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Technological glitches like server crash, slow speed, or service halt are often momentary and should not be interpreted as targeted or malicious actions by our team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                4. Best Effort Commitment
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We make every effort to deliver uninterrupted services with high uptime. However, <strong className="text-white font-semibold">no platform can promise 100% uptime</strong>, especially those running on third-party hosting infrastructures. We encourage users to consider this reality and prepare accordingly when scheduling events or public games.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-red-500 mb-4">
                5. Misuse of the Generated Website
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Any website generated using starttambola.in must not be used for fraudulent, scam-related, or suspicious activities. If a website is found to be involved in such behavior, it will be <strong className="text-white font-semibold">permanently banned</strong>.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                The associated phone number and email address will be <strong className="text-white font-semibold">blacklisted</strong>, meaning that any future registrations using the same contact information will also be denied. This measure helps protect the integrity of the platform and the wider user base.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                <strong className="text-white font-semibold">No refunds</strong> will be issued in such cases, as the platform incurs costs to publish and host each website.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Even if a new website is generated under a different name, if it is directly or indirectly linked to a previously blacklisted user, it will also be banned without warning.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                No appeal, retaliation, or dispute will be considered valid in such cases. The user accepts full responsibility for using the platform ethically and legally. Misuse of the platform for any activity that is morally, financially, or socially harmful will lead to permanent termination of access.
              </p>
            </section>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
