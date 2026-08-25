import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DemoVideoModal from "@/components/DemoVideoModal";

export const metadata: Metadata = {
  title: "How It Works — GetTambola",
  description: "Learn how to register and run your own Tambola game easily with GetTambola.",
};

export default function HowItWorksPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-dark-bg py-12">
        <div className="mx-auto max-w-4xl px-6">
          
          {/* Header Section */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-10 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
              How GetTambola Works?
            </h1>
            <p className="text-gray-400 text-sm">
              Generate a Tambola game link in a few clicks. No account, no login.
            </p>
            
            {/* Video Demo Button */}
            <DemoVideoModal />
          </div>

          {/* Section 1 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Section 1: How to Register
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-300 text-sm">
              <li>Click on <strong className="text-white">Register Now</strong>.</li>
              <li>Select a design of your choice.</li>
              <li>Fill up the form with your details.</li>
              <li>Select a plan and checkout.</li>
              <li>Your game link will be generated and sent to your email or phone.</li>
            </ol>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Section 2: How to Use It
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-300 text-sm">
              <li>Share the <strong className="text-white">player link</strong> with your players.</li>
              <li>Login to your <strong className="text-white">admin link</strong> with your password. Set date, time, total tickets and prizes, then save the game.</li>
              <li>The player link will now show available tickets to book.</li>
              <li>Create a poster with our free poster maker and share with players.</li>
              <li>You can create agent accounts for employees to help with bookings.</li>
              <li>Players send booking requests from the player link, and you or your agent can confirm them.</li>
              <li>When the game starts, tickets are auto-marked and winners declared automatically.</li>
            </ol>
          </div>

          {/* Need Help */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Need Help?
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              We provide 24x7 support. Click below to chat with us on WhatsApp.
            </p>
            <a 
              href="https://api.whatsapp.com/send?phone=919606914772&text=Hi%20GetTambola%20team!%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20 border border-white/10"
            >
              Chat with Support
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
