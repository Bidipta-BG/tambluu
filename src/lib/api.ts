/**
 * Typed API client for the Tambluu backend.
 *
 * Base URL is read from the NEXT_PUBLIC_API_BASE_URL environment variable so
 * that it is accessible on both the server and the client (Next.js inlines
 * variables prefixed with NEXT_PUBLIC_ at build time).
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Thin fetch wrapper that:
 *  - Prepends the configured base URL.
 *  - Sets `Content-Type: application/json` for requests that carry a body.
 *  - Throws a descriptive error for non-2xx responses.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };

  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    const text = await response.text().catch(() => "(no body)");
    throw new Error(
      `API error ${response.status} ${response.statusText} — ${url}: ${text}`,
    );
  }

  // Return parsed JSON, or undefined for 204 No Content.
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Shared domain types (extend in src/types/ as the project grows)
// ---------------------------------------------------------------------------

/** Subscription plan chosen by the customer. */
export type Plan = "monthly" | "yearly";

/** Payload sent to create a new tenant (store). */
export interface CreateTenantInput {
  /** The business / store display name. */
  businessName: string;
  /** Full name of the account owner. */
  ownerName: string;
  /** Email address used as the admin login. */
  ownerEmail: string;
  /** Contact phone number of the owner. */
  ownerPhone: string;
  /**
   * The domain the customer would like (e.g. "mytambola.online").
   * Manually registered and connected by the platform team within 24 hours.
   */
  desiredDomain: string;
  /** Subscription plan selected by the customer. */
  plan: Plan;
  /** Initial password for the tenant admin account. */
  password: string;
  /** Selected theme ID. */
  themeId?: string;
}

/** Server response after a tenant is successfully created. */
export interface CreateTenantResponse {
  tenantId: string;
  businessName: string;
  ownerEmail: string;
  desiredDomain: string;
  plan: Plan;
  createdAt: string;
}

/** Payload sent to initiate a Razorpay checkout session. */
export interface CreateCheckoutSessionInput {
  /** The tenant for whom the order is being created. */
  tenantId: string;
  /** The selected subscription plan. */
  plan: Plan;
}

/** Razorpay order details returned by the backend. */
export interface CreateCheckoutSessionResponse {
  /** Razorpay order ID ("order_XXXX"). */
  orderId: string;
  /** Razorpay public key ("rzp_live_XXX" or "rzp_test_XXX"). Safe to expose to the browser. */
  keyId: string;
  /** Amount to charge, in paise (1 INR = 100 paise). */
  amount: number;
  /** ISO currency code, e.g. "INR". */
  currency: string;
  /** Subscription plan associated with this order. */
  plan: Plan;
  /** Business name — used in the Razorpay modal and the order summary. */
  businessName: string;
  /** Echo of the tenantId for convenience. */
  tenantId: string;
  /**
   * Owner's phone number — passed through to the confirmation page so the
   * success message can tell the user which number their links will be sent to.
   */
  ownerPhone: string;
}

export interface Theme {
  id: string;
  name: string;
  preview_image_url: string;
  config: any;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function getThemes(): Promise<Theme[]> {
  try {
    const res = await apiFetch<{ data: Theme[] }>("/themes", {
      next: { revalidate: 60 } // cache for 1 minute
    });
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch themes:", error);
    return [];
  }
}

/**
 * Create a new tenant (store) on the platform.
 *
 * Currently targets POST /internal/tenants — the backend's internal endpoint
 * which requires a super-admin key.
 *
 * ⚠️  SECURITY FLAG — ACTION REQUIRED before production:
 *
 *   This endpoint is an INTERNAL admin endpoint that should NEVER be called
 *   directly from the public frontend with an embedded secret key. Two safe
 *   options:
 *
 *   Option A) Create a separate public-facing endpoint (e.g. POST /signup or
 *             POST /public/tenants) that does not require the internal key and
 *             has its own rate-limiting / CAPTCHA / abuse protection.
 *
 *   Option B) Add a Next.js Route Handler (app/api/signup/route.ts) that holds
 *             the internal key server-side and proxies the request to the
 *             backend — keeping the secret out of the browser bundle entirely.
 *
 *   Do NOT add the internal key to any NEXT_PUBLIC_ variable or to frontend
 *   code. Please resolve this before connecting a real backend.
 *
 * TODO: replace /internal/tenants with the agreed public-facing path once
 * the backend team ships it (or add a Route Handler proxy).
 */
export async function createTenant(
  input: CreateTenantInput,
): Promise<CreateTenantResponse> {
  const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_INTERNAL_API_KEY is not configured");
  }

  const res = await apiFetch<{ data: any }>("/internal/tenants", {
    method: "POST",
    headers: {
      "x-internal-key": apiKey,
    },
    body: JSON.stringify({
      businessName: input.businessName,
      domain: input.desiredDomain,
      ownerName: input.ownerName,
      ownerEmail: input.ownerEmail,
      ownerPhone: input.ownerPhone,
      ownerPassword: input.password,
      plan: input.plan,
      themeId: input.themeId,
    }),
  });

  return {
    tenantId: res.data.tenant.id,
    businessName: res.data.tenant.business_name,
    ownerEmail: res.data.tenant.owner_email,
    desiredDomain: res.data.tenant.domain,
    plan: input.plan,
    createdAt: res.data.tenant.created_at,
  };
}

/**
 * Create a Razorpay order for the given tenant.
 *
 * Calls POST /tenants/{tenantId}/checkout-session.
 * The backend looks up the tenant's plan and amount, creates a Razorpay order,
 * and returns the order details needed to open the payment modal client-side.
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResponse> {
  // Mock response for UI testing until backend is connected
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: "order_" + Date.now(),
        keyId: "rzp_test_mockKey123",
        amount: input.plan === "monthly" ? 560000 : 3120000,
        currency: "INR",
        plan: input.plan,
        businessName: "Mock Tambola Business",
        tenantId: input.tenantId,
        ownerPhone: "9876543210",
      });
    }, 1000);
  });
}
