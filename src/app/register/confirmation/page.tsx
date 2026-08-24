import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "You're in! — Tambluu",
  description:
    "Payment received. Your branded Tambola website is being set up and our team will contact you within 12 hours.",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SuccessIcon() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      {/* Outer ring */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-green-100"
      />
      {/* Inner ring */}
      <span
        aria-hidden
        className="absolute inset-3 rounded-full bg-green-200"
      />
      {/* Check */}
      <svg
        aria-hidden
        className="relative h-10 w-10 text-green-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  );
}

function FailureIcon() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <span aria-hidden className="absolute inset-0 rounded-full bg-red-100" />
      <span aria-hidden className="absolute inset-3 rounded-full bg-red-200" />
      <svg
        aria-hidden
        className="relative h-10 w-10 text-red-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-[--color-muted]">{label}</span>
      <span className="break-all text-right font-medium text-[--color-foreground]">
        {value}
      </span>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    id: "what-happens-next",
    question: "What happens next?",
    answer:
      "Your Tambola platform has been automatically created! Our team will contact you within 12 hours with your Admin and Player WhatsApp links.",
  },
  {
    id: "dns-instructions",
    question: "How do I connect my domain?",
    answer:
      "To make your website live, log into your domain registrar (GoDaddy, Namecheap, etc.) and add an A Record pointing to the IP address 76.76.21.21. Your site will instantly go live once the DNS propagates.",
  },
  {
    id: "change-domain",
    question: "Can I change my domain later?",
    answer:
      "Yes — contact us within the first 7 days and we can change it at no extra charge. After that, domain changes may incur a small fee depending on your current plan. Get in touch at xomdigital@gmail.com.",
  },
  {
    id: "contact-support",
    question: "How do I contact support?",
    answer:
      "Email us at xomdigital@gmail.com or WhatsApp us at +91 96069 14772 (placeholder — the real number will be added here). We respond within a few hours on business days.",
  },
] as const;

function FaqItem({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: string;
}) {
  return (
    <details
      id={id}
      className="group rounded-xl border border-[--color-border] bg-white"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-[--color-foreground] marker:hidden">
        {question}
        {/* Chevron — rotates open via group-open */}
        <svg
          aria-hidden
          className="h-4 w-4 shrink-0 text-[--color-muted] transition-transform duration-200 group-open:rotate-180"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="border-t border-[--color-border] px-5 pb-4 pt-3">
        <p className="text-sm leading-relaxed text-[--color-muted]">{answer}</p>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Server-side payment verification helper
// ---------------------------------------------------------------------------

async function verifyPayment(orderId: string): Promise<{
  isPaid: boolean;
  cfPaymentId: string | null;
}> {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    console.error("Cashfree credentials are not configured on the server.");
    return { isPaid: false, cfPaymentId: null };
  }

  try {
    const cfResponse = await fetch(`https://api.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": appId,
        "x-client-secret": secretKey,
      },
      cache: "no-store",
    });

    if (!cfResponse.ok) {
      console.error("Cashfree verify-order error:", cfResponse.status);
      return { isPaid: false, cfPaymentId: null };
    }

    const cfData = await cfResponse.json();
    
    // Extract the most recent payment ID if available.
    const payments: Array<{ cf_payment_id?: string }> = cfData.order_payments ?? [];
    const cfPaymentId = payments[0]?.cf_payment_id?.toString() ?? null;

    return {
      isPaid: cfData.order_status === "PAID",
      cfPaymentId,
    };
  } catch (err) {
    console.error("verifyPayment error:", err);
    return { isPaid: false, cfPaymentId: null };
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    order_id?: string;
    tenantId?: string;
    phone?: string;
  }>;
}) {
  const { order_id, tenantId, phone } = await searchParams;

  // Guard: must arrive here via the checkout flow.
  if (!tenantId) {
    redirect("/register");
  }

  // Verify the payment status before showing the success screen.
  const { isPaid, cfPaymentId } = order_id
    ? await verifyPayment(order_id)
    : { isPaid: false, cfPaymentId: null };

  // Mask all but the last 4 digits of the phone number for display.
  // e.g. "9876543210" → "••••••3210"
  const maskedPhone = phone
    ? phone.replace(/\d(?=\d{4})/g, "•")
    : null;

  return (
    <>
      {/* Minimal nav */}
      <header className="border-b border-[--color-border] bg-[--color-surface]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[--color-foreground] transition-opacity hover:opacity-75"
          >
            tambluu
          </Link>
          <a
            href="mailto:xomdigital@gmail.com"
            className="text-sm text-[--color-muted] hover:text-[--color-foreground]"
          >
            Need help?
          </a>
        </div>
      </header>

      <main className="flex-1 bg-[--color-subtle]">
        <div className="mx-auto max-w-lg px-6 py-12">

          {/* ── Step indicator ── */}
          <div className="mb-8 text-center">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isPaid ? "Step 3 of 3 — You're in!" : "Payment Incomplete"}
            </span>
          </div>

          {/* ── Main card ── */}
          <div className={`rounded-2xl border px-6 py-8 shadow-sm sm:px-8 bg-white ${isPaid ? "border-green-200" : "border-red-200"}`}>

            {isPaid ? <SuccessIcon /> : <FailureIcon />}

            {/* Headline */}
            <div className="mt-6 text-center">
              {isPaid ? (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[--color-foreground]">
                    Payment Successful!
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-[--color-muted]">
                    Your Tambola website is being set up.{" "}
                    <strong className="font-semibold text-[--color-foreground]">
                      Our team will contact you within 12 hours
                    </strong>{" "}
                    with your Player, Admin, and Agent links on WhatsApp.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-tight text-[--color-foreground]">
                    Payment Not Confirmed
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-[--color-muted]">
                    We could not confirm your payment. If you believe this is a mistake,
                    please contact us at{" "}
                    <a href="mailto:xomdigital@gmail.com" className="font-semibold text-[--color-foreground] underline">
                      xomdigital@gmail.com
                    </a>{" "}
                    with your order reference below.
                  </p>
                </>
              )}

              {/* Phone callout — only on success */}
              {isPaid && maskedPhone && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2">
                  {/* WhatsApp icon */}
                  <svg
                    aria-hidden
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Sending to {maskedPhone}
                  </span>
                </div>
              )}
            </div>

            {/* Divider */}
            <hr className="my-6 border-[--color-border]" />

            {/* Reference details */}
            <div className="divide-y divide-[--color-border] rounded-lg bg-[--color-subtle] px-4">
              <InfoRow label="Store reference" value={tenantId} />
              {order_id && (
                <InfoRow label="Order ID" value={order_id} />
              )}
              {cfPaymentId && (
                <InfoRow label="Payment ID" value={cfPaymentId} />
              )}
            </div>

            <p className="mt-3 text-center text-xs text-[--color-muted]">
              Keep these references handy in case you need to contact support.
            </p>

            {/* Divider */}
            <hr className="my-6 border-[--color-border]" />

            {/* Return home */}
            <Link
              id="confirmation-home"
              href="/"
              className="block w-full rounded-lg border border-[--color-border] bg-white py-3 text-center text-sm font-medium text-[--color-foreground] transition-colors hover:bg-[--color-subtle]"
            >
              ← Back to tambluu.com
            </Link>
          </div>

          {/* ── FAQ — only shown on success ── */}
          {isPaid && (
            <section aria-labelledby="faq-heading" className="mt-10">
              <h2
                id="faq-heading"
                className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-[--color-muted]"
              >
                What happens next?
              </h2>
              <div className="space-y-3">
                {FAQ_ITEMS.map((item) => (
                  <FaqItem key={item.id} {...item} />
                ))}
              </div>
            </section>
          )}

          {/* ── Support nudge ── */}
          <p className="mt-8 text-center text-sm text-[--color-muted]">
            Questions? Email{" "}
            <a
              href="mailto:xomdigital@gmail.com"
              className="font-medium text-[--color-accent] underline underline-offset-2 hover:text-[--color-accent-hover]"
            >
              xomdigital@gmail.com
            </a>{" "}
            — we reply within a few hours.
          </p>
        </div>
      </main>

      <footer className="border-t border-[--color-border] bg-[--color-subtle]">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-xs text-[--color-muted]">
          &copy; {new Date().getFullYear()} Tambluu. All rights reserved.
        </div>
      </footer>
    </>
  );
}
