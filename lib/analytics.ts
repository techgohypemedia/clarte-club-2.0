import { parsePrice } from "./cart-offers"

/*
 * Storefront events for the Meta Pixel and Google Analytics (both loaded in app/layout.tsx).
 * PageView is sent by the pixel snippet; InitiateCheckout / AddPaymentInfo / Purchase are sent by Pragma's
 * checkout script (public/onecheckout/1checkout.js). This file adds the two steps in between:
 * ViewContent (product page) and AddToCart.
 *
 * content_ids are Shopify variant IDs with content_type "product", which is how Shopify's Meta catalog
 * identifies items, so the events can be matched to catalog products for retargeting.
 */

type TrackedProduct = {
  merchandiseId?: string
  title: string
  price: string
  quantity?: number
}

type Tracker = (...args: unknown[]) => void

// The pixel/gtag stubs are injected right after hydration; wait briefly if an event fires before them
function whenReady(name: "fbq" | "gtag", run: (fn: Tracker) => void, attempt = 0) {
  if (typeof window === "undefined") return
  const fn = (window as unknown as Record<string, Tracker | undefined>)[name]
  if (typeof fn === "function") {
    try {
      run(fn)
    } catch {}
  } else if (attempt < 20) {
    setTimeout(() => whenReady(name, run, attempt + 1), 250)
  }
}

function variantNumericId(merchandiseId?: string): string | null {
  const match = String(merchandiseId ?? "").match(/(\d+)(?:\?.*)?$/)
  return match ? match[1] : null
}

function send(metaEvent: "ViewContent" | "AddToCart", gaEvent: "view_item" | "add_to_cart", product: TrackedProduct) {
  const id = variantNumericId(product.merchandiseId)
  // Without a variant ID the event can't be matched to the catalog, and a nameless/empty event only adds noise
  if (!id) return
  const quantity = product.quantity ?? 1
  const unitPrice = parsePrice(product.price)
  const value = unitPrice * quantity

  whenReady("fbq", (fbq) =>
    fbq("track", metaEvent, {
      content_ids: [id],
      content_type: "product",
      content_name: product.title,
      contents: [{ id, quantity, item_price: unitPrice }],
      value,
      currency: "INR",
    })
  )
  whenReady("gtag", (gtag) =>
    gtag("event", gaEvent, {
      currency: "INR",
      value,
      items: [{ item_id: id, item_name: product.title, price: unitPrice, quantity }],
    })
  )
}

export function trackViewContent(product: TrackedProduct) {
  send("ViewContent", "view_item", product)
}

export function trackAddToCart(product: TrackedProduct) {
  send("AddToCart", "add_to_cart", product)
}
