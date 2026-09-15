import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  fetchAllProducts,
} from "./shopify"

export type CartItem = {
  id: string
  merchandiseId?: string
  image: string
  alt: string
  title: string
  size: string
  price: string
  quantity: number
}

const CART_KEY = "clarte_cart_items"
const SHOPIFY_CART_ID_KEY = "clarte_shopify_cart_id"
const SHOPIFY_CHECKOUT_URL_KEY = "clarte_shopify_checkout_url"
const APPLIED_COUPON_KEY = "clarte_applied_coupon"

export function getAppliedCoupon(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(APPLIED_COUPON_KEY)
}

export function setAppliedCoupon(code: string | null) {
  if (typeof window === "undefined") return
  if (code) {
    localStorage.setItem(APPLIED_COUPON_KEY, code)
  } else {
    localStorage.removeItem(APPLIED_COUPON_KEY)
  }
  window.dispatchEvent(new CustomEvent("coupon-updated", { detail: { code } }))
}

export function getShopifyCartId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(SHOPIFY_CART_ID_KEY)
}

export function getShopifyCheckoutUrl(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(SHOPIFY_CHECKOUT_URL_KEY)
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CART_KEY)
  if (!stored) {
    const initialItems: CartItem[] = [
      {
        id: "cart-item-1",
        image: "/images/products/product1.png",
        alt: "Model wearing Heritage Oval sunglasses in glossy black frame",
        title: "Heritage Oval",
        size: "XS",
        price: "₹ 4,500",
        quantity: 1,
      },
      {
        id: "cart-item-2",
        image: "/images/products/product3.png",
        alt: "Model wearing Heritage Aviator sunglasses with dark metal frame",
        title: "Heritage Aviator",
        size: "XS",
        price: "₹ 4,500",
        quantity: 1,
      },
    ]
    localStorage.setItem(CART_KEY, JSON.stringify(initialItems))
    return initialItems
  }
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("cart-updated"))
}

export async function syncShopifyCart(item: CartItem) {
  if (!item.merchandiseId) return
  try {
    const cartId = getShopifyCartId()
    if (!cartId) {
      const cart = await cartCreate([
        {
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
        },
      ])
      if (cart?.id) {
        localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id)
        if (cart.checkoutUrl) {
          localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, cart.checkoutUrl)
        }
      }
    } else {
      await cartLinesAdd(cartId, [
        {
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
        },
      ])
    }
  } catch (error) {
    console.warn("Failed to sync cart with Shopify API:", error)
  }
}

export function addToCart(
  item: Omit<CartItem, "quantity">,
  options: { openCart?: boolean } = { openCart: true }
) {
  const items = getCartItems()
  const existing = items.find((i) => i.id === item.id && i.size === item.size)
  let updatedItem: CartItem
  if (existing) {
    existing.quantity += 1
    updatedItem = existing
  } else {
    updatedItem = { ...item, quantity: 1 }
    items.push(updatedItem)
  }
  saveCartItems(items)
  syncShopifyCart(updatedItem)

  if (options.openCart !== false) {
    window.dispatchEvent(
      new CustomEvent("cart-updated", { detail: { open: true, addedItem: item } })
    )
  } else {
    window.dispatchEvent(
      new CustomEvent("cart-updated", { detail: { open: false } })
    )
  }
}

export async function buyNow(
  item: Omit<CartItem, "quantity"> & { quantity?: number },
  options?: { couponCode?: string }
): Promise<string | null> {
  if (typeof window === "undefined") return null

  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "shapar-ay.myshopify.com"
  const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
  const discountCode = options?.couponCode || getAppliedCoupon()

  let merchandiseId = item.merchandiseId

  // 1. Auto-resolve missing merchandiseId from live Shopify products if not provided
  if (!merchandiseId) {
    try {
      const liveProducts = await fetchAllProducts(50)
      if (liveProducts && liveProducts.length > 0) {
        const matched =
          liveProducts.find(
            (p: any) =>
              (p.title && item.title && p.title.toLowerCase() === item.title.toLowerCase()) ||
              (p.handle && item.title && p.handle.toLowerCase() === item.title.toLowerCase().replace(/\s+/g, "-")) ||
              p.id === item.id ||
              p.handle === item.id
          ) || liveProducts[0]

        merchandiseId = matched?.variants?.[0]?.id || matched?.id
      }
    } catch (err) {
      console.warn("Could not auto-resolve live Shopify product variant ID for Buy Now:", err)
    }
  }

  // 2. Direct Shopify Cart Permalink for ONLY this single item (does not touch or include local cart items)
  if (merchandiseId) {
    const numericId = merchandiseId
      .replace(/^.*\/ProductVariant\//, "")
      .replace(/^.*\/Product\//, "")

    if (numericId) {
      const discountParam = discountCode ? `?discount=${encodeURIComponent(discountCode)}` : ""
      const permalinkUrl = `https://${shopifyDomain}/cart/${numericId}:${quantity}${discountParam}`
      window.location.href = permalinkUrl
      return permalinkUrl
    }
  }

  // 3. Fallback: Create isolated single-item Shopify Cart via Storefront API (without saving over existing cart id)
  if (merchandiseId) {
    try {
      const cart = await cartCreate([
        {
          merchandiseId,
          quantity,
        },
      ])
      if (cart?.checkoutUrl) {
        const finalCheckoutUrl = discountCode
          ? `${cart.checkoutUrl}${cart.checkoutUrl.includes("?") ? "&" : "?"}discount=${encodeURIComponent(discountCode)}`
          : cart.checkoutUrl
        window.location.href = finalCheckoutUrl
        return finalCheckoutUrl
      }
    } catch (error) {
      console.warn("Shopify cartCreate failed for Buy Now:", error)
    }
  }

  // Final Fallback: Direct checkout
  const checkoutUrl = discountCode
    ? `https://${shopifyDomain}/checkout?discount=${encodeURIComponent(discountCode)}`
    : `https://${shopifyDomain}/checkout`
  window.location.href = checkoutUrl
  return checkoutUrl
}


export function updateCartQuantity(id: string, size: string, quantity: number) {
  let items = getCartItems()
  if (quantity <= 0) {
    items = items.filter((i) => !(i.id === id && i.size === size))
  } else {
    const item = items.find((i) => i.id === id && i.size === size)
    if (item) item.quantity = quantity
  }
  saveCartItems(items)
}

export function removeFromCart(id: string, size: string) {
  let items = getCartItems()
  items = items.filter((i) => !(i.id === id && i.size === size))
  saveCartItems(items)
}

export async function processShopifyCheckout(discountCode?: string): Promise<string | null> {
  if (typeof window === "undefined") return null

  let items = getCartItems()
  if (items.length === 0) {
    alert("Your cart is empty.")
    return null
  }

  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "shapar-ay.myshopify.com"
  const coupon = discountCode || getAppliedCoupon()

  // 1. Auto-resolve missing merchandiseIds from live Shopify products if needed
  const missingMerchandise = items.some((item) => !item.merchandiseId)
  if (missingMerchandise) {
    try {
      const liveProducts = await fetchAllProducts(50)
      if (liveProducts && liveProducts.length > 0) {
        let hasChanges = false
        items = items.map((item, idx) => {
          if (item.merchandiseId) return item
          const matched =
            liveProducts.find(
              (p: any) =>
                p.title?.toLowerCase() === item.title.toLowerCase() ||
                p.handle?.toLowerCase() === item.title.toLowerCase().replace(/\s+/g, "-")
            ) || liveProducts[idx % liveProducts.length]

          const variantId = matched?.variants?.[0]?.id || matched?.id
          if (variantId) {
            hasChanges = true
            return { ...item, merchandiseId: variantId }
          }
          return item
        })
        if (hasChanges) {
          saveCartItems(items)
        }
      }
    } catch (err) {
      console.warn("Could not auto-resolve live Shopify product variant IDs:", err)
    }
  }

  // 2. Direct Shopify Cart Permalink (Fastest & 100% reliable direct Checkout redirect)
  const permalinkParts = items
    .map((item) => {
      if (!item.merchandiseId) return null
      const numericId = item.merchandiseId.replace(/^.*\/ProductVariant\//, "").replace(/^.*\/Product\//, "")
      return numericId ? `${numericId}:${item.quantity}` : null
    })
    .filter(Boolean)

  if (permalinkParts.length > 0) {
    const discountParam = coupon ? `?discount=${encodeURIComponent(coupon)}` : ""
    const permalinkUrl = `https://${shopifyDomain}/cart/${permalinkParts.join(",")}${discountParam}`
    window.location.href = permalinkUrl
    return permalinkUrl
  }

  // 3. Fallback: Create Shopify Cart via Storefront API
  const validLines = items
    .filter((item) => item.merchandiseId)
    .map((item) => ({
      merchandiseId: item.merchandiseId!,
      quantity: item.quantity,
    }))

  if (validLines.length > 0) {
    try {
      const cart = await cartCreate(validLines)
      if (cart?.checkoutUrl) {
        localStorage.setItem(SHOPIFY_CART_ID_KEY, cart.id)
        localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, cart.checkoutUrl)

        const finalUrl = coupon
          ? `${cart.checkoutUrl}${cart.checkoutUrl.includes("?") ? "&" : "?"}discount=${encodeURIComponent(coupon)}`
          : cart.checkoutUrl

        window.location.href = finalUrl
        return finalUrl
      }
    } catch (error) {
      console.warn("Shopify cartCreate failed:", error)
    }
  }

  // 4. Fallback A: Saved checkout URL
  const existingCheckoutUrl = getShopifyCheckoutUrl()
  if (existingCheckoutUrl) {
    const finalUrl = coupon
      ? `${existingCheckoutUrl}${existingCheckoutUrl.includes("?") ? "&" : "?"}discount=${encodeURIComponent(coupon)}`
      : existingCheckoutUrl
    window.location.href = finalUrl
    return finalUrl
  }

  // Final Fallback: Direct checkout
  const checkoutUrl = coupon
    ? `https://${shopifyDomain}/checkout?discount=${encodeURIComponent(coupon)}`
    : `https://${shopifyDomain}/checkout`
  window.location.href = checkoutUrl
  return checkoutUrl
}




