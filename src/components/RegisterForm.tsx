"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTenant, getThemes } from "@/lib/api";
import type { Plan, Theme } from "@/lib/api";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  websiteName: string;
  password: string;
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
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  
  if (!fields.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(fields.phone.replace(/\D/g, ''))) {
    errors.phone = "Phone number must be exactly 10 digits.";
  }
  
  if (!fields.websiteName.trim()) {
    errors.websiteName = "Website name is required.";
  }
  
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (!PASSWORD_RE.test(fields.password)) {
    errors.password = "Password must be at least 8 characters and contain letters, numbers, and special characters (e.g. @, #).";
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
  
  const [themes, setThemes] = useState<Theme[]>([]);
  useEffect(() => {
    getThemes().then(setThemes).catch(console.error);
  }, []);

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    websiteName: "",
    password: "",
    themeId: initialThemeId,
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const fieldErrors = validate(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
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
      router.push(`/register/checkout?${query.toString()}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
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
            onChange={(e) => set("email", e.target.value)}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-white text-sm font-bold mb-2">Your phone number</label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
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
              onChange={(e) => set("websiteName", e.target.value.replace(/\.online$/i, ''))}
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
          <label className="block text-white text-sm font-bold mb-2">Your require website password</label>
          <input
            type="text"
            value={fields.password}
            onChange={(e) => set("password", e.target.value)}
            className="w-full px-4 py-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-accent font-medium"
            placeholder="Letters, numbers, special characters"
          />
          {errors.password && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.password}</p>}
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
