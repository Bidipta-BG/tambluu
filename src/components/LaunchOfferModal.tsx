"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LaunchOfferModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || isClosed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsClosed(true)}
      />

      {/* Modal card — scrollable if viewport is too short */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-red-400" />

        {/* Close button */}
        <button
          onClick={() => setIsClosed(true)}
          aria-label="Close offer"
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
        >
          ✕
        </button>

        <div className="px-6 py-5">
          {/* Badge */}
          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-600 uppercase tracking-wide">
              🎉 New Launch Offer — 20% OFF
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-center text-lg font-bold text-gray-900 mb-0.5">
            Start Your Tambola Website
          </h2>
          <p className="text-center text-xs text-gray-500 mb-4">
            First month at a special price · Limited time only
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-lg font-semibold text-gray-400 line-through">
              ₹4,500
            </span>
            <span className="text-4xl font-bold text-accent">₹3,600</span>
            <span className="text-xs text-gray-500 self-end mb-1">/month</span>
          </div>
          <p className="text-center text-xs text-gray-400 mb-4 italic">
            Renews at ₹4,500/month thereafter
          </p>

          {/* Feature bullets */}
          <ul className="space-y-1.5 mb-4">
            {[
              "Your own branded Tambola website",
              "Unlimited game runs & automated calling",
              "Agent management & ticket tracking",
              "Auto winner detection & reporting",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="mt-0.5 text-green-500 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-200 py-2 mb-4">
            <span className="text-base">🟢</span>
            <span className="text-xs font-semibold text-green-700">
              100+ organizers already live with GetTambola
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/themes?plan=monthly&offer=launch"
              className="flex-1 rounded-lg bg-accent py-3 text-center text-sm font-bold text-white shadow-md transition-colors hover:bg-accent-hover"
              onClick={() => setIsClosed(true)}
            >
              Claim Offer Now →
            </Link>
            <button
              onClick={() => setIsClosed(true)}
              className="flex-1 rounded-lg border border-gray-200 py-3 text-center text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
