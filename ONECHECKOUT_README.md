# 1Checkout Next.js integration

This storefront keeps every existing Shopify checkout and Buy Now button unchanged. A separate browser script finds those buttons after React renders them, clones their existing DOM/classes, inserts the clone in the same position, and applies `dc-none` to the original. The clone therefore uses the exact styling and responsive layout of the original button while sending the customer to 1Checkout.

> **Maintenance note:** If you add a new Buy Now button, update `public/onecheckout/1checkout.js` as well so the new button is detected and redirects the customer to 1Checkout.

> **Configuration note:** The 1Checkout API key, API host, and checkout host must come from environment variables; never hardcode their values in the script or README.

## Complete integration file list

- `.env.local` — local values for the required 1Checkout environment variables; ignored by Git.
- `.env.example` — value-free list of required environment variable names.
- `.gitignore` — keeps `.env.local` private while allowing `.env.example` to be committed.
- `app/layout.tsx` — injects environment-backed configuration, connection hints, modal markup, CSS, and the client script.
- `app/onecheckout.css` — modal, isolation, loader, and replacement-button state styles.
- `app/api/onecheckout/product/route.ts` — resolves Shopify products for injected Buy Now actions.
- `components/onecheckout/OneCheckoutModal.tsx` — React modal shell and iframe container.
- `public/onecheckout/1checkout.js` — button replacement and 1Checkout client logic.
- `public/onecheckout/1checkout_logo.png` — 1Checkout logo shown in the loader.
- `ONECHECKOUT_README.md` — integration documentation and maintenance notes.

## Files added

- `public/onecheckout/1checkout.js`
  - Finds buttons whose visible label is `Buy Now`, `Buy it now`, `Checkout`, or `Proceed to Checkout` (including product-card `aria-label` values beginning with `Buy now`).
  - Clones each original button before hiding it. No checkout button component was edited.
  - Watches React/Next.js DOM updates so buttons rendered later in drawers, dialogs, cards, or route changes are also handled.
  - Reads cart checkout items from the existing `clarte_cart_items` local-storage key and converts them to the Shopify `/cart.json` shape used by the supplied 1Checkout script.
  - Resolves a Buy Now product, builds a single-item checkout payload, calls the configured create endpoint, and loads the configured checkout widget in the modal iframe.
  - Retains the supplied attribution/cookie forwarding, API timeout/retry, progress messages, body scroll lock, iframe communication, Shopify fallback, Meta/Google checkout events, Razorpay handoff, and successful-order cart clearing behavior.
  - If 1Checkout reports an invalid key, inactive merchant, unauthorized request, or asks to redirect to Shopify, the hidden original button is programmatically clicked. This preserves the storefront's existing Shopify fallback logic.

- `components/onecheckout/OneCheckoutModal.tsx`
  - Next.js/React version of `snippets/1checkout-modal.liquid`.
  - Contains the hidden modal state input, loading/progress UI, brand logo, 1Checkout logo location, and iframe container.
  - Does not add a host-page close button. Closing is handled only by 1Checkout's built-in iframe control and its `exit_checkout` message.

- `app/onecheckout.css`
  - Next.js version of `assets/1checkout.css`.
  - Styles the modal, progress animation, loading/error states, and `dc-none` utility.
  - Replacement buttons intentionally do not receive a new visual design; each one is a clone of its original so its styling and placement stay identical.
  - Uses the maximum practical z-index (`2147483647`) so the checkout remains above headers, drawers, dialogs, and floating widgets.

## Modal interaction isolation

While 1Checkout is open, the integration:

- makes every other direct child of `<body>` inert and inaccessible to pointer/keyboard input;
- prevents background pointer and click events at the document capture phase;
- locks body scrolling and pauses the site's Lenis scrolling instance;
- moves keyboard focus into the checkout surface and traps `Tab`/`Shift+Tab` inside the modal;
- blocks the Escape key so it cannot dismiss the checkout;
- ignores clicks on the dark area outside the checkout panel;
- restores the previous inert, `aria-hidden`, scrolling, and focus states after 1Checkout sends its close event.

- `app/api/onecheckout/product/route.ts`
  - Read-only product resolver used only by injected Buy Now buttons.
  - Resolves the current Shopify product by URL handle or product title and returns the variant data required for the single-item payload.

## Existing file updated

- `app/layout.tsx`
  - Imports `app/onecheckout.css` globally.
  - Adds environment-backed DNS-prefetch and preconnect hints for the API and checkout hosts, plus the 1Checkout CDN hint, in `<head>`.
  - Renders `OneCheckoutModal` near the end of `<body>`.
  - Loads `/onecheckout/1checkout.js` with Next.js `Script` using `afterInteractive`, after React hydration.

No code was changed in:

- `components/cart/CartSidebar.tsx`
- `app/cart/page.tsx`
- `components/product/ProductSummary.tsx`
- `components/product/ProductQuickViewModal.tsx`
- `components/home/TrendingSection.tsx`
- `lib/cart.ts`

Their original Shopify handlers remain available as the fallback.

## Where to paste the PNG

The logo is stored at this exact path:

`public/onecheckout/1checkout_logo.png`

To replace it, paste the new PNG at the same path and keep the exact filename. Its public URL is `/onecheckout/1checkout_logo.png`.

## Configuration

Set these keys in `.env.local` for local development and in the deployment provider's environment settings for production:

- `ONECHECKOUT_API_KEY`
- `ONECHECKOUT_API_HOST`
- `ONECHECKOUT_CHECKOUT_HOST`

The root layout reads these server-side values and initializes `window.__ONE_CHECKOUT_CONFIG__` before `/onecheckout/1checkout.js` runs. Restart the development server after changing `.env.local`.

## Disable switch and test checklist

The supplied `d1c` local-storage behavior is retained. To temporarily disable replacement buttons in a browser, set an unexpired `d1c` value using the same `{ value, expires }` storage format, then reload.

Recommended checks:

1. Add a product to the cart and open the cart sidebar. Confirm the original `CHECKOUT` button is hidden and the injected one looks identical.
2. Open `/cart`. Confirm `PROCEED TO CHECKOUT` has identical width, spacing, hover, and disabled behavior.
3. Open a product page, quick view, and product card. Confirm every `BUY NOW` clone matches the original.
4. Click each replacement and confirm the progress modal opens, creates a checkout, and loads the 1Checkout iframe.
5. Close the iframe and confirm page scrolling is restored.
6. Test the Shopify fallback by disabling the merchant/API key in a non-production environment.
