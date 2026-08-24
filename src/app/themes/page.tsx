"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";

const THEMES = [
  { id: "11111111-1111-1111-1111-111111111111", name: "FESTIVAL GLOW", src: "/images/1festivalglow.jpg" },
  { id: "22222222-2222-2222-2222-222222222222", name: "NORTHEAST ESSENCE", src: "/images/2northeastessence.jpg" },
  { id: "33333333-3333-3333-3333-333333333333", name: "ROYAL TAMBOLA", src: "/images/3royaltambola.jpg" },
  { id: "44444444-4444-4444-4444-444444444444", name: "NEON NIGHT", src: "/images/4neonnight.jpg" },
  { id: "55555555-5555-5555-5555-555555555555", name: "COLOR SPLASH", src: "/images/5colorsplash.jpg" },
];

function ThemesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan"); // Carry forward the plan if any
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedTheme) return;
    const query = new URLSearchParams();
    query.set("theme", selectedTheme);
    if (plan) query.set("plan", plan);
    router.push(`/register?${query.toString()}`);
  };

  return (
    <main className="flex-1 bg-dark-bg py-16">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="text-center mb-12">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent mb-4">
            Step 1 of 3 — Select a Theme
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
            Choose Your Game Design
          </h1>
          <p className="text-gray-400 text-sm">
            Select a theme for your Tambola platform. You can always change this later.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-32">
          {THEMES.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div 
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`cursor-pointer rounded-2xl border-4 overflow-hidden transition-all duration-200 bg-white/5 ${isSelected ? 'border-accent shadow-[0_0_20px_rgba(220,38,38,0.5)] transform scale-[1.02]' : 'border-transparent hover:border-white/20'}`}
              >
                <div className="relative aspect-[9/16] w-full bg-gray-900">
                  <Image 
                    src={theme.src} 
                    alt={theme.name} 
                    fill 
                    className="object-cover" 
                  />
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-accent text-white rounded-full p-1 shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className={`p-4 text-center ${isSelected ? 'bg-accent text-white' : 'text-gray-300'}`}>
                  <p className="font-bold">{theme.name}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-dark-bg/90 p-4 backdrop-blur-md sm:p-6 flex justify-center">
        <button 
          onClick={handleContinue}
          disabled={!selectedTheme}
          className={`rounded px-10 py-4 text-base font-bold shadow-2xl transition-all w-full max-w-md ${selectedTheme ? 'bg-accent text-white hover:bg-accent-hover scale-105' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
          {selectedTheme ? 'Continue to Registration ↗' : 'Select a Design to Continue'}
        </button>
      </div>
    </main>
  );
}

export default function ThemesPage() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="min-h-screen bg-dark-bg" />}>
        <ThemesContent />
      </Suspense>
    </>
  );
}
