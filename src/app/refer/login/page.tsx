"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isPendingActivation, setIsPendingActivation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPendingActivation(false);

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/referral/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invalid credentials");
      }

      const data = await res.json();
      
      if (data.isActive) {
        router.push("/refer/dashboard");
      } else {
        setIsPendingActivation(true);
        setSubmitting(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-[#063940] border border-[#063940] rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-black py-5 border-b border-white/10">
        <h2 className="text-white text-center font-bold text-xl uppercase tracking-wider">
          Referral Login
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        {registered && !isPendingActivation && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 text-sm p-3 rounded mb-4 text-center">
            Registration successful! Please log in.
          </div>
        )}

        {isPendingActivation && (
          <div className="bg-orange-500/10 border border-orange-500 text-orange-400 text-sm p-4 rounded mb-4">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              <span>⏳</span> Account Under Review
            </h3>
            <p>Your referral account is currently under review by our team. You'll receive a WhatsApp message once activated.</p>
          </div>
        )}

        <div>
          <label className="block text-white text-sm font-bold mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
              className="w-full pl-4 pr-12 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded transition-colors text-lg disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="text-center pt-4 space-y-2">
          <p className="text-sm text-gray-300">
            <a href="https://api.whatsapp.com/send?phone=919606914772&text=Hi%20GetTambola%20team!%20I%20forgot%20my%20referral%20password." target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              Forgot password?
            </a>
          </p>
          <p className="text-sm text-gray-300">
            Don't have an account? <Link href="/refer/signup" className="text-white font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function ReferLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
