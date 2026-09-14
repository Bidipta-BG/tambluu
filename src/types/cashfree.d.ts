/**
 * Type declarations for @cashfreepayments/cashfree-js
 *
 * The package ships without TypeScript types. This file provides minimal
 * typings sufficient for the Cashfree Hosted Checkout (modal) integration.
 */

declare module "@cashfreepayments/cashfree-js" {
  export type CashfreeMode = "sandbox" | "production";

  export type CashfreeRedirectTarget =
    | "_self"
    | "_blank"
    | "_top"
    | "_modal"
    | HTMLElement;

  export interface CashfreeCheckoutOptions {
    /** The payment_session_id received from the create-order API response. */
    paymentSessionId: string;
    /** How the checkout page opens. Use "_modal" for a popup. */
    redirectTarget?: CashfreeRedirectTarget;
  }

  export interface CashfreeInstance {
    /**
     * Opens the Cashfree hosted checkout.
     * Returns a Promise that resolves when the modal is closed.
     */
    checkout(options: CashfreeCheckoutOptions): Promise<void>;
  }

  export interface LoadOptions {
    mode: CashfreeMode;
  }

  /**
   * Loads the Cashfree JS SDK asynchronously.
   * Returns null when called in a server (non-browser) environment.
   */
  export function load(options: LoadOptions): Promise<CashfreeInstance | null>;
}
