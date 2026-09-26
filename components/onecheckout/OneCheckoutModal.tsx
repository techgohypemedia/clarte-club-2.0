"use client"

export function OneCheckoutModal() {
  return (
    <>
      <input
        className="checkoutmodal-state"
        id="checkoutModal"
        type="checkbox"
        autoComplete="off"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        className="checkoutmodal"
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        aria-labelledby="checkoutLoadingMessage"
        tabIndex={-1}
      >
        <div className="inner">
          <div className="overlay" aria-hidden="true" />
          <div className="splash-screen">
            <div className="checkout-progressbar dc-none">
              {/* The brand logo stays remote, matching the supplied Shopify snippet. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://www.clarteclub.in/logo.svg" alt="Clarte Club" />
              <div className="linewrap" aria-hidden="true">
                <div className="line" />
              </div>
              {/* Paste the supplied PNG at public/onecheckout/1checkout_logo.png. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/onecheckout/1checkout_logo.png"
                alt="1Checkout"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden"
                }}
              />
            </div>
            <span id="checkoutLoadingMessage" aria-live="polite">
              Crafting your cart
            </span>
          </div>
          <div className="iframe-container" />
        </div>
      </div>
      <span id="onecheckout-button-purpose" className="sr-only">
        Opens the secure 1Checkout payment window.
      </span>
    </>
  )
}
