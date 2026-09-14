import type { Metadata } from "next";
import Link from "next/link";
import { PRICING } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Refer & Earn Free Games — GetTambola",
  description: "Join the GetTambola Referral Program. Refer friends and earn free months for your Tambola website.",
};

export default function ReferPage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-bold text-red-500 mb-6">
            GetTambola Referral Program
          </span>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Turn Referrals Into <span className="text-accent">FREE Games</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
            Share GetTambola with other organizers. Your friends get a discount, and you earn free months for your website. It&apos;s a win-win!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/refer/signup"
              className="w-full sm:w-auto rounded bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Join the Referral Program →
            </Link>
            <Link
              href="/refer/login"
              className="w-full sm:w-auto rounded border border-white/20 bg-transparent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/5"
            >
              Already joined? Login
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/10 bg-black/20 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold text-white">How It Works</h2>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Register & Get Code</h3>
              <p className="text-gray-400">
                Sign up for the referral program to receive your unique referral code and tracking link.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Share Your Link</h3>
              <p className="text-gray-400">
                Share it with other organizers. They get ₹{PRICING.referralDiscount} OFF their first month when they use your code!
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Earn Free Months</h3>
              <p className="text-gray-400">
                Earn 1 point for a monthly referral and 10 points for a yearly referral. 10 points = 1 FREE Month!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Card */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border-2 border-accent bg-[#063940] p-8 text-center shadow-2xl sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="text-9xl">🎁</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white">The Ultimate Reward</h2>
            <p className="mb-8 text-xl text-gray-300">
              For every 10 points you collect, you unlock <span className="font-bold text-accent">1 FREE Month</span> of GetTambola.
            </p>
            <Link
              href="/refer/signup"
              className="inline-block rounded bg-accent px-8 py-4 text-base font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Start Earning Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
