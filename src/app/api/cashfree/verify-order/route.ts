import { NextRequest, NextResponse } from "next/server";

const CASHFREE_BASE_URL = "https://api.cashfree.com/pg";
const API_VERSION = "2025-01-01";

/**
 * GET /api/cashfree/verify-order?order_id=xxx
 *
 * Verifies the payment status of a Cashfree order server-side.
 * Returns: { orderStatus, cfPaymentId }
 *
 * orderStatus values: "PAID" | "ACTIVE" | "EXPIRED" | "CANCELLED" | "TERMINATION_REQUESTED"
 * An order is successful only when orderStatus === "PAID".
 */
export async function GET(request: NextRequest) {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    return NextResponse.json(
      { error: "Cashfree credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const orderId = request.nextUrl.searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json(
      { error: "Missing required query param: order_id." },
      { status: 400 }
    );
  }

  const cfResponse = await fetch(`${CASHFREE_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-version": API_VERSION,
      "x-client-id": appId,
      "x-client-secret": secretKey,
    },
    // Never cache payment verification responses.
    cache: "no-store",
  });

  if (!cfResponse.ok) {
    const errorText = await cfResponse.text().catch(() => "(no body)");
    console.error("Cashfree verify-order error:", cfResponse.status, errorText);
    return NextResponse.json(
      { error: `Failed to verify Cashfree order: ${cfResponse.status}` },
      { status: 502 }
    );
  }

  const cfData = await cfResponse.json();

  // Extract the most recent payment ID if available.
  const payments: Array<{ cf_payment_id?: string }> = cfData.order_payments ?? [];
  const cfPaymentId = payments[0]?.cf_payment_id?.toString() ?? null;

  return NextResponse.json({
    orderStatus: cfData.order_status as string,
    cfPaymentId,
  });
}
