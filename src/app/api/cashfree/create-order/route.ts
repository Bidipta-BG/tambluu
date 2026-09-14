import { NextRequest, NextResponse } from "next/server";

const CASHFREE_BASE_URL = "https://api.cashfree.com/pg";
const API_VERSION = "2025-01-01";

// Production amounts
const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 1,
  yearly: 25200,
};

/**
 * POST /api/cashfree/create-order
 *
 * Creates a Cashfree order server-side (secret key never exposed to the browser).
 *
 * Body: { tenantId, plan, ownerName, ownerEmail, ownerPhone }
 * Returns: { paymentSessionId, orderId }
 */
export async function POST(request: NextRequest) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    return NextResponse.json(
      { error: "Cashfree credentials are not configured on the server." },
      { status: 500 }
    );
  }

  let body: {
    tenantId?: string;
    plan?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { tenantId, plan, ownerName, ownerEmail, ownerPhone } = body;

  if (!tenantId || !plan || !ownerName || !ownerEmail || !ownerPhone) {
    return NextResponse.json(
      { error: "Missing required fields: tenantId, plan, ownerName, ownerEmail, ownerPhone." },
      { status: 400 }
    );
  }

  const orderAmount = PLAN_AMOUNTS[plan];
  if (!orderAmount) {
    return NextResponse.json(
      { error: `Unknown plan: ${plan}. Must be "monthly" or "yearly".` },
      { status: 400 }
    );
  }

  // Build the return URL.
  // CASHFREE_RETURN_URL_BASE must be an https:// URL — Cashfree's production
  // API rejects http:// return URLs. Set this to your live domain in .env.local.
  // Cashfree replaces {order_id} automatically at redirect time.
  const returnUrlBase = process.env.CASHFREE_RETURN_URL_BASE;
  if (!returnUrlBase || !returnUrlBase.startsWith("https://")) {
    return NextResponse.json(
      {
        error:
          "CASHFREE_RETURN_URL_BASE is not configured or is not an https:// URL. " +
          "Set it to your production domain (e.g. https://gettambola.in) in .env.local.",
      },
      { status: 500 }
    );
  }

  const returnUrl =
    `${returnUrlBase.replace(/\/$/, "")}/register/confirmation` +
    `?order_id={order_id}` +
    `&tenantId=${encodeURIComponent(tenantId)}` +
    `&phone=${encodeURIComponent(ownerPhone)}`;

  const cashfreePayload = {
    order_amount: orderAmount,
    order_currency: "INR",
    customer_details: {
      customer_id: tenantId,
      customer_name: ownerName,
      customer_email: ownerEmail,
      customer_phone: ownerPhone.startsWith("+91") ? ownerPhone : `+91${ownerPhone}`,
    },
    order_meta: {
      return_url: returnUrl,
    },
  };

  const cfResponse = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-version": API_VERSION,
      "x-client-id": appId,
      "x-client-secret": secretKey,
    },
    body: JSON.stringify(cashfreePayload),
  });

  if (!cfResponse.ok) {
    const errorText = await cfResponse.text().catch(() => "(no body)");
    console.error("Cashfree create-order error:", cfResponse.status, errorText);
    return NextResponse.json(
      { error: `Failed to create Cashfree order: ${cfResponse.status}` },
      { status: 502 }
    );
  }

  const cfData = await cfResponse.json();

  return NextResponse.json({
    paymentSessionId: cfData.payment_session_id as string,
    orderId: cfData.order_id as string,
  });
}
