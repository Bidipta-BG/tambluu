/**
 * Global type augmentation for the Razorpay checkout.js script.
 *
 * Loaded dynamically from https://checkout.razorpay.com/v1/checkout.js
 * This file is referenced by src/components/CheckoutView.tsx.
 *
 * Razorpay docs: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 */

export interface RazorpayOptions {
  /** Razorpay public API key — safe to expose in the browser. */
  key: string;
  /**
   * Amount in the smallest currency sub-unit.
   * For INR this is paise (₹1 = 100 paise).
   */
  amount: number;
  /** ISO 4217 currency code, e.g. "INR". */
  currency: string;
  /** Business name shown in the payment modal header. */
  name: string;
  /** Short description shown below the name. */
  description?: string;
  /** URL of the logo shown in the modal. */
  image?: string;
  /** Razorpay order ID returned from the backend ("order_XXXX"). */
  order_id: string;
  /** Pre-fill customer details to speed up the checkout flow. */
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  /** Key-value metadata attached to the payment. */
  notes?: Record<string, string>;
  /** Modal theme options. */
  theme?: {
    /** Accent/CTA button colour. Accepts any CSS colour string. */
    color?: string;
  };
  /**
   * Called by Razorpay after a successful payment.
   * Redirect to confirmation at this point — do NOT fulfil the order here;
   * always verify the signature server-side first.
   */
  handler: (response: RazorpaySuccessResponse) => void;
  /** Modal lifecycle hooks. */
  modal?: {
    /** Called when the user closes the modal without completing payment. */
    ondismiss?: () => void;
    /**
     * Whether to show a confirmation dialog before closing.
     * Default: false.
     */
    confirm_close?: boolean;
    /** Whether pressing Escape closes the modal. Default: true. */
    escape?: boolean;
  };
}

/** Payload passed to the handler on successful payment. */
export interface RazorpaySuccessResponse {
  /** Payment ID — use this on the backend for capture/verification. */
  razorpay_payment_id: string;
  /** The Razorpay order ID the payment was created against. */
  razorpay_order_id: string;
  /**
   * HMAC-SHA256 signature.
   * MUST be verified server-side before fulfilling the order.
   */
  razorpay_signature: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}
