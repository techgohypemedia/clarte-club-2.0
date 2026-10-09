import type { CartItem } from "./cart"

/*
 * Cart offers shown in the cart sidebar and on /cart.
 *
 * How the multi-frame discount reaches payment:
 *  1. Each tier has a Shopify discount CODE (create these in Shopify admin; see `code` below).
 *  2. The cart sync (lib/cart.ts) picks the code for the current number of frames, applies it to the customer's
 *     Shopify cart and saves it as the applied coupon. Pragma's 1Checkout script reads that coupon and sends it
 *     to checkout as discount_codes, so the discounted total is what the customer pays.
 *  3. The discount is only SHOWN in our cart once Shopify confirms the code is applicable, so the cart never
 *     promises a discount checkout won't give (e.g. before the codes exist in Shopify).
 * To switch the multi-frame offer off entirely, set MULTI_FRAME_TIERS to [].
 */

// Additional cart discount by number of frames in the cart. Highest matching tier wins.
// Each code must exist in Shopify: percentage off the order, minimum quantity of items = minItems.
export const MULTI_FRAME_TIERS: { minItems: number; rate: number; code: string }[] = [
  { minItems: 2, rate: 0.1, code: "CLARTE10" },
  { minItems: 3, rate: 0.15, code: "CLARTE15" },
]

// Display-only gift: one kit per frame, never added to the stored cart or sent to checkout
export const FREE_KIT = {
  name: "Clarté Club Kit",
  includes: "Gift box · Hard case · Cleaning cloth · Pouch · Member card",
  image: "/images/clarte-club-kit.webp",
}

const VERIFIED_OFFER_KEY = "clarte_offer_code_verified"

export function parsePrice(price: string | undefined): number {
  return Number.parseFloat(String(price ?? "").replace(/[^0-9.]/g, "")) || 0
}

export function formatRupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`
}

function countFrames(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, item.quantity), 0)
}

function tierFor(itemCount: number) {
  return [...MULTI_FRAME_TIERS].reverse().find((t) => itemCount >= t.minItems) ?? null
}

/** The discount code the cart qualifies for right now, or null. */
export function getOfferCode(items: CartItem[]): string | null {
  return tierFor(countFrames(items))?.code ?? null
}

export function isOfferCode(code: string | null | undefined): boolean {
  return !!code && MULTI_FRAME_TIERS.some((t) => t.code.toUpperCase() === code.toUpperCase())
}

/** Set by the cart sync once Shopify confirms the code applies to this cart. */
export function setVerifiedOfferCode(code: string | null) {
  try {
    if (code) localStorage.setItem(VERIFIED_OFFER_KEY, code)
    else localStorage.removeItem(VERIFIED_OFFER_KEY)
  } catch {}
}

function getVerifiedOfferCode(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(VERIFIED_OFFER_KEY)
  } catch {
    return null
  }
}

export type CartOffer = {
  itemCount: number
  subtotal: number
  rate: number
  discount: number
  total: number
  kitQuantity: number
  next: { itemsNeeded: number; rate: number } | null
}

export function getCartOffer(items: CartItem[]): CartOffer {
  const itemCount = countFrames(items)
  const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)
  const tier = tierFor(itemCount)
  // Only count the discount once Shopify has confirmed this tier's code for the cart (what checkout will charge)
  const rate = tier && tier.code === getVerifiedOfferCode() ? tier.rate : 0
  const discount = Math.round(subtotal * rate)
  const nextTier = MULTI_FRAME_TIERS.find((t) => t.minItems > itemCount)
  return {
    itemCount,
    subtotal,
    rate,
    discount,
    total: subtotal - discount,
    kitQuantity: itemCount,
    next: nextTier ? { itemsNeeded: nextTier.minItems - itemCount, rate: nextTier.rate } : null,
  }
}
