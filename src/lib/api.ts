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

/** Payload sent to the Next.js Route Handler to create a Cashfree order. */
export interface CreateCashfreeOrderInput {
  tenantId: string;
  plan: Plan;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

/** Response from the create-order Route Handler. */
export interface CreateCashfreeOrderResponse {
  /** Cashfree payment session ID — passed to cashfree.checkout() on the client. */
  paymentSessionId: string;
  /** Cashfree order ID — used for verification on the confirmation page. */
  orderId: string;
}

/** Response from the verify-order Route Handler. */
export interface VerifyCashfreeOrderResponse {
  /**
   * Cashfree order status.
   * A payment is successful only when this equals "PAID".
   */
  orderStatus: "PAID" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "TERMINATION_REQUESTED" | string;
  /** Cashfree payment ID for the completed transaction, if available. */
  cfPaymentId: string | null;
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
 * Create a Cashfree order via the Next.js Route Handler.
 *
 * This calls our own /api/cashfree/create-order endpoint which holds the
 * Cashfree secret key server-side. The browser never sees the secret key.
 *
 * Returns the paymentSessionId needed to open the Cashfree checkout modal.
 */
export async function createCashfreeOrder(
  input: CreateCashfreeOrderInput,
): Promise<CreateCashfreeOrderResponse> {
  const response = await fetch("/api/cashfree/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.error ?? `Failed to create payment order (${response.status}).`,
    );
  }

  return response.json() as Promise<CreateCashfreeOrderResponse>;
}

/**
 * Verify a Cashfree order's payment status via the Next.js Route Handler.
 *
 * Should be called server-side (from the confirmation page) before delivering
 * any service to the customer. Only trust the result when orderStatus === "PAID".
 */
export async function verifyCashfreeOrder(
  orderId: string,
): Promise<VerifyCashfreeOrderResponse> {
  const response = await fetch(
    `/api/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.error ?? `Failed to verify payment (${response.status}).`,
    );
  }

  return response.json() as Promise<VerifyCashfreeOrderResponse>;
}
