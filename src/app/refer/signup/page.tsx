"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
const PASSWORD_RE = /^.{4,}$/;

export default function ReferSignupPage() {
  const router = useRouter();
  
  const [fields, setFields] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof fields>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function set(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const newErrors: Partial<typeof fields> = {};
    if (!fields.name.trim()) newErrors.name = "Name is required.";
    if (!EMAIL_RE.test(fields.email.trim())) newErrors.email = "Valid email is required.";
    if (!PHONE_RE.test(fields.mobile.replace(/\D/g, ''))) newErrors.mobile = "10 digit mobile required.";
    if (!PASSWORD_RE.test(fields.password)) newErrors.password = "Password must be at least 4 characters.";
    if (fields.password !== fields.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/referral/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          mobile: fields.mobile.trim(),
          password: fields.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to register");
      }

      router.push("/refer/login?registered=1");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-[#063940] border border-[#063940] rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-black py-5 border-b border-white/10">
          <h2 className="text-white text-center font-bold text-xl uppercase tracking-wider">
            Referral Signup
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} noValidate className="p-8 space-y-5">
          <div>
            <label className="block text-white text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              value={fields.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value.replace(/\s/g, ""))}
              className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">Mobile Number</label>
            <input
              type="tel"
              value={fields.mobile}
              onChange={(e) => set("mobile", e.target.value.replace(/\s/g, ""))}
              className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
              placeholder="10 digit number"
            />
            {errors.mobile && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={fields.password}
                onChange={(e) => set("password", e.target.value.replace(/\s/g, ""))}
                className="w-full pl-4 pr-12 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                placeholder="At least 4 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-white text-sm font-bold mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={fields.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value.replace(/\s/g, ""))}
                className="w-full pl-4 pr-12 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
                placeholder="Re-enter password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded">
              {submitError}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded transition-colors text-lg disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Join Now"}
            </button>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-sm text-gray-300">
              Already have an account? <Link href="/refer/login" className="text-white font-bold hover:underline">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
