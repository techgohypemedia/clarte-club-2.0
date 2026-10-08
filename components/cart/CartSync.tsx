"use client"

import { useEffect } from "react"

import { clearCart, initCart } from "@/lib/cart"

// Mounted once in the root layout: reconciles the saved cart with Shopify on every page load.
export function CartSync() {
  useEffect(() => {
    void initCart()

    // After an order, 1Checkout's own script (public/onecheckout/1checkout.js, left untouched) clears the cart
    // items in localStorage. This also drops the saved-cart cookie, which that script doesn't know about,
    // so purchased items don't come back on the next visit.
    const checkoutHost = String(
      (window as unknown as { __ONE_CHECKOUT_CONFIG__?: { checkoutHost?: string } }).__ONE_CHECKOUT_CONFIG__
        ?.checkoutHost ?? ""
    ).replace(/\/+$/, "")
    const onMessage = (event: MessageEvent) => {
      if (!checkoutHost || event.origin !== checkoutHost || event.data?.topic !== "1CHECKOUT") return
      if (event.data.message === "clear_cart" || event.data.message === "order_placed") clearCart()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return null
}
