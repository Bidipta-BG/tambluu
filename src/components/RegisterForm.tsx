"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTenant, checkAvailability } from "@/lib/api";
import type { Plan } from "@/lib/api";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  websiteName: string;
  password: string;
  confirmPassword: string;
  themeId: string;
}

type FieldErrors = Partial<Record<keyof FormFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/; // 10 digits
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; 
// at least one letter, one number, one special character, min 8 chars.

function validate(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {};

  if (!fields.name.trim()) errors.name = "Name is required.";
  
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (/\s/.test(fields.email)) {
    errors.email = "Email cannot contain spaces.";
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  
  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (/\s/.test(fields.phone)) {
    errors.phone = "Phone number cannot contain spaces.";
  } else if (!PHONE_RE.test(fields.phone.replace(/\D/g, ''))) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }
  
  if (!fields.websiteName.trim()) {
    errors.websiteName = "Website name is required.";
  } else if (/\s/.test(fields.websiteName)) {
    errors.websiteName = "Website name cannot contain spaces.";
  }
  
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (/\s/.test(fields.password)) {
    errors.password = "Password cannot contain spaces.";
  } else if (!PASSWORD_RE.test(fields.password)) {
    errors.password = "Password must be at least 8 characters and contain letters, numbers, and special characters (e.g. @, #).";
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!fields.themeId) {
    errors.themeId = "Please select a theme.";
  }

  return errors;
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const plan: Plan = planParam === "monthly" ? "monthly" : "yearly";
  const initialThemeId = searchParams.get("theme") || "";
  

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    websiteName: "",
    password: "",
    confirmPassword: "",
    themeId: initialThemeId,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function set<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  // ── RDAP global domain availability check ──────────────────────────────────
  // Queries the official .online registry (Radix) directly from the browser.
  // Returns true  → domain is free to use.
  // Returns true  → optimistic fallback if the check fails for any reason
  //                 (network error, timeout, CORS issue) so a third-party
  //                 outage never blocks a legitimate registration.
  // Returns false → domain is already registered on the internet.
  async function checkRdapAvailability(domain: string): Promise<boolean> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout
    try {
      const res = await fetch(
        `https://rdap.radix.host/rdap/domain/${encodeURIComponent(domain)}`,
        { signal: controller.signal },
      );
      clearTimeout(timeout);
      if (res.status === 404) return true;   // domain is free
      if (res.status === 200) return false;  // domain is registered
      return true;                           // unexpected status → optimistic
    } catch {
      clearTimeout(timeout);
      return true; // network error / timeout / CORS → optimistic, don't block user
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    // ── Step 1 [NEW]: RDAP global domain availability check ─────────────────
    // Runs before anything else so the user knows immediately if the domain
    // name they want is already registered somewhere on the internet.
    setSubmitting(true); // start spinner here so the button isn't unresponsive
    const domainToCheck = fields.websiteName.trim() + ".online";
    const isDomainGloballyAvailable = await checkRdapAvailability(domainToCheck);
    if (!isDomainGloballyAvailable) {
      setErrors({
        websiteName: `"${fields.websiteName.trim()}.online" is already registered on the internet. Please choose a different name.`,
      });
      setSubmitting(false);
      return;
    }

    // ── Step 2: Client-side format validation ────────────────────────────────
    const fieldErrors = validate(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    // ── Step 3: Pre-flight duplicate check (your database) ───────────────────
    try {
      const availability = await checkAvailability({
        email:  fields.email.trim(),
        phone:  fields.phone.trim(),
        domain: fields.websiteName.trim() + ".online",
      });

      const availabilityErrors: typeof fieldErrors = {};
      if (availability.emailTaken)  availabilityErrors.email       = "This email is already registered. Please use a different email.";
      if (availability.phoneTaken)  availabilityErrors.phone       = "This phone number is already registered. Please use a different number.";
      if (availability.domainTaken) availabilityErrors.websiteName = "This website name is already taken. Please choose a different name.";

      if (Object.keys(availabilityErrors).length > 0) {
        setErrors(availabilityErrors);
        setSubmitting(false);
        return;
      }
    } catch (checkErr) {
      // checkAvailability itself failed (network error, 500, etc.).
      // We MUST stop here — never fall through to createTenant with unverified data.
      setSubmitError("Unable to verify your details. Please check your connection and try again.");
      setSubmitting(false);
      return;
    }

    // ── Step 3: Create tenant ────────────────────────────────────────────────
    try {
      const result = await createTenant({
        businessName: fields.websiteName.trim() + ".online",
        ownerName: fields.name.trim(),
        ownerEmail: fields.email.trim(),
        ownerPhone: fields.phone.trim(),
        desiredDomain: fields.websiteName.trim() + ".online",
        plan: plan,
        password: fields.password,
        themeId: fields.themeId,
      });

      const query = new URLSearchParams(searchParams.toString());
      query.set("tenantId", result.tenantId);
      query.set("ownerName", fields.name.trim());
      query.set("ownerEmail", fields.email.trim());
      query.set("ownerPhone", fields.phone.trim());
      router.push(`/register/checkout?${query.toString()}`);
    } catch (err) {
      // Check if this is a 409 CONFLICT from the backend (duplicate field)
      const statusCode = (err as any)?.statusCode;
      const code       = (err as any)?.code;
      const msg        = err instanceof Error ? err.message.toLowerCase() : "";

      if (statusCode === 409 || code === "CONFLICT") {
        // Map the conflict to the specific field so the user sees an inline error
        if (msg.includes("email")) {
          setErrors({ email: "This email is already registered. Please use a different email." });
        } else if (msg.includes("domain") || msg.includes("already exists")) {
          setErrors({ websiteName: "This website name is already taken. Please choose a different name." });
        } else if (msg.includes("phone")) {
          setErrors({ phone: "This phone number is already registered. Please use a different number." });
        } else {
          setSubmitError("A conflict occurred. Please check your details and try again.");
        }
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-[#063940] border border-[#063940] rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-black py-5 border-b border-white/10">
        <h2 className="text-white text-center font-bold text-xl uppercase tracking-wider">
          REGISTRATION FORM
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
        
        <div>
          <label className="block text-white text-sm font-bold mb-2">Your name</label>
          <input
            type="text"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Your email id</label>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value.replace(/\s/g, ""))}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Your phone number</label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\s/g, ""))}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
            placeholder="10 digit number"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Your require website name</label>
          <div className="flex bg-white rounded focus-within:ring-2 focus-within:ring-accent overflow-hidden">
            <input
              type="text"
              value={fields.websiteName}
              onChange={(e) => set("websiteName", e.target.value.replace(/\s/g, "").replace(/\.online$/i, ''))}
              className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-transparent text-black outline-none font-medium"
              placeholder="mytambola"
            />
            <div className="flex items-center shrink-0 px-2 sm:px-4 bg-gray-200 text-gray-700 font-bold border-l border-gray-300 pointer-events-none text-sm sm:text-base">
              .online
            </div>
          </div>
          {errors.websiteName && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.websiteName}</p>}
        </div>

        {/* Theme selection UI removed as per request (theme is passed via URL) */}
        {errors.themeId && <p className="text-red-400 text-sm mt-1.5 font-bold mb-4">{errors.themeId}</p>}

        <div>
          <label className="block text-white text-sm font-bold mb-2">Your Admin Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={fields.password}
              onChange={(e) => set("password", e.target.value.replace(/\s/g, ""))}
              className="w-full pl-4 pr-12 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
              placeholder="Letters, numbers, special characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Re-enter Your Admin Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={fields.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value.replace(/\s/g, ""))}
              className="w-full pl-4 pr-12 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
              placeholder="Re-enter your admin password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.confirmPassword}</p>}
          
          <div className="mt-4 p-4 bg-black/20 border border-white/10 rounded-lg">
            <p className="text-xs text-gray-300 leading-relaxed">
              <span className="font-bold text-[#ff9d4a]">Important Note:</span> Remember your admin login password. This cannot be recovered if you forget it. Once logged into the admin panel, you can change your password.
            </p>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded">
            {submitError}
          </div>
        )}

        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-16 rounded transition-colors text-lg"
          >
            {submitting ? "PROCESSING..." : "NEXT STEP"}
          </button>
        </div>

      </form>
    </div>
  );
}
