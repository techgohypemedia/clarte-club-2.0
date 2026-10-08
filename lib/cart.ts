import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  cartQuery,
  fetchAllProducts,
  fetchProductByHandle,
  fetchVariantsByIds,
  formatMoney,
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

/*
 * Cart persistence model
 * ----------------------
 * The Shopify cart is the source of truth. Its ID is kept in localStorage AND in a 1-year cookie on the root
 * domain, so it survives localStorage being wiped and is shared between www and the bare domain.
 * The item list in localStorage is only a cache so the cart renders instantly.
 *
 * - Every local change marks the cart "dirty" and is pushed to Shopify (debounced, serialized).
 * - On page load: if there are unsynced local changes, local is pushed to Shopify; otherwise the Shopify
 *   cart is pulled into local. An expired Shopify cart is recreated from the local items.
 * - Cart links (/cart?cart=..., /cart/c/<token>?key=..., /cart/<variant>:<qty>,...) replace the cart with
 *   exactly the linked products and quantities.
 */

const CART_KEY = "clarte_cart_items"
const SHOPIFY_CART_ID_KEY = "clarte_shopify_cart_id"
const SHOPIFY_CHECKOUT_URL_KEY = "clarte_shopify_checkout_url"
const APPLIED_COUPON_KEY = "clarte_applied_coupon"
const DIRTY_KEY = "clarte_cart_dirty"
// Bumped when the sync model changed: carts from before it are re-pushed from local once, which also
// repairs Shopify carts whose quantities were inflated by the old add-sync.
const SYNC_VERSION_KEY = "clarte_cart_sync_v"
const SYNC_VERSION = "2"
const CART_COOKIE = "clarte_cart"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/* ================= Storage ================= */

function cookieDomain(): string {
  const host = window.location.hostname
  if (host === "localhost" || /^[\d.]+$/.test(host) || !host.includes(".")) return ""
  return `; domain=.${host.replace(/^www\./, "")}`
}

function readCartCookie(): string | null {
  const row = document.cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith(`${CART_COOKIE}=`))
  return row ? decodeURIComponent(row.slice(CART_COOKIE.length + 1)) : null
}

function setShopifyCartId(id: string | null, checkoutUrl?: string | null) {
  try {
    if (id) {
      localStorage.setItem(SHOPIFY_CART_ID_KEY, id)
      document.cookie = `${CART_COOKIE}=${encodeURIComponent(id)}; max-age=${COOKIE_MAX_AGE}; path=/${cookieDomain()}; SameSite=Lax`
    } else {
      localStorage.removeItem(SHOPIFY_CART_ID_KEY)
      localStorage.removeItem(SHOPIFY_CHECKOUT_URL_KEY)
      document.cookie = `${CART_COOKIE}=; max-age=0; path=/${cookieDomain()}; SameSite=Lax`
    }
    if (checkoutUrl) localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, checkoutUrl)
  } catch {}
}

function isDirty(): boolean {
  try {
    if (localStorage.getItem(DIRTY_KEY) === "1") return true
    // Cart saved by the old sync: push it once. Only when there ARE local items: empty storage without the
    // version marker means storage was wiped, and pushing that would empty the customer's Shopify cart.
    return localStorage.getItem(SYNC_VERSION_KEY) !== SYNC_VERSION && getCartItems().length > 0
  } catch {
    return false
  }
}

function setDirty(dirty: boolean) {
  try {
    if (dirty) {
      localStorage.setItem(DIRTY_KEY, "1")
    } else {
      localStorage.removeItem(DIRTY_KEY)
      localStorage.setItem(SYNC_VERSION_KEY, SYNC_VERSION)
    }
  } catch {}
}

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
  try {
    const stored = localStorage.getItem(SHOPIFY_CART_ID_KEY)
    if (stored) return stored
    // localStorage was wiped (in-app browsers, storage pressure) but the cookie survived: recover the cart
    const fromCookie = readCartCookie()
    if (fromCookie) localStorage.setItem(SHOPIFY_CART_ID_KEY, fromCookie)
    return fromCookie
  } catch {
    return readCartCookie()
  }
}

export function getShopifyCheckoutUrl(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(SHOPIFY_CHECKOUT_URL_KEY)
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CART_KEY)
    if (!stored) return []
    const parsed: CartItem[] = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    // Filter out any legacy mock demo items from initial dev
    return parsed.filter((item) => item && item.id !== "cart-item-1" && item.id !== "cart-item-2")
  } catch {
    return []
  }
}

// Writes the local cache only (no Shopify push). Used when the data came from Shopify.
function writeLocalItems(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {}
  window.dispatchEvent(new CustomEvent("cart-updated"))
}

// A customer-made change: save locally, then push it to Shopify.
export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return
  setDirty(true)
  writeLocalItems(items)
  scheduleSync()
}

/* ================= Shopify mapping ================= */

type ShopifyVariant = {
  __typename?: string
  id: string
  title?: string
  price?: { amount: string; currencyCode: string }
  selectedOptions?: { name: string; value: string }[]
  product?: { handle?: string; title?: string; featuredImage?: { url: string; altText?: string | null } | null }
}

type ShopifyCart = {
  id: string
  checkoutUrl?: string
  lines?: { nodes?: { id: string; quantity: number; merchandise?: ShopifyVariant }[] }
}

function variantSize(merchandise: ShopifyVariant | null | undefined): string {
  const option = merchandise?.selectedOptions?.find((o) => /size/i.test(o?.name ?? ""))
  if (option?.value) return option.value
  return merchandise?.title && merchandise.title !== "Default Title" ? merchandise.title : ""
}

function itemFromVariant(merchandise: ShopifyVariant, quantity: number, previous?: CartItem): CartItem {
  const product = merchandise?.product ?? {}
  return {
    // Keep the existing local identity (slug, size, image) so rows and keys stay stable
    id: previous?.id ?? product.handle ?? merchandise.id,
    merchandiseId: merchandise.id,
    image: previous?.image || product.featuredImage?.url || "/images/products/product1.png",
    alt: previous?.alt || product.featuredImage?.altText || product.title || "Product",
    title: previous?.title || product.title || "Product",
    size: previous?.size ?? variantSize(merchandise),
    price: merchandise?.price?.amount
      ? formatMoney(merchandise.price.amount, merchandise.price.currencyCode)
      : previous?.price ?? "",
    quantity,
  }
}

function itemsFromShopifyCart(cart: ShopifyCart | null, previous: CartItem[]): CartItem[] {
  const lines = cart?.lines?.nodes ?? []
  return lines.flatMap((line) => {
    const merchandise = line?.merchandise
    if (merchandise?.__typename !== "ProductVariant" || line.quantity <= 0) return []
    return [itemFromVariant(merchandise, line.quantity, previous.find((p) => p.merchandiseId === merchandise.id))]
  })
}

// Shopify can only hold variants; resolve any local item that is missing its variant ID by its product handle.
async function resolveMissingMerchandise(items: CartItem[]): Promise<CartItem[]> {
  if (items.every((i) => i.merchandiseId)) return items
  let catalog: Awaited<ReturnType<typeof fetchAllProducts>> | null = null
  const resolved = await Promise.all(
    items.map(async (item) => {
      if (item.merchandiseId) return item
      try {
        const product = await fetchProductByHandle(item.id)
        const variant =
          product?.variants?.find((v: ShopifyVariant) => variantSize(v) === item.size) ?? product?.variants?.[0]
        if (variant?.id) return { ...item, merchandiseId: variant.id }
        // Fall back to an exact title match only. Never guess a different product.
        catalog ??= await fetchAllProducts(100)
        const byTitle = catalog?.find((p) => p?.title?.toLowerCase() === item.title.toLowerCase())
        const titleVariant = byTitle?.variants?.[0]?.id
        return titleVariant ? { ...item, merchandiseId: titleVariant } : item
      } catch {
        return item
      }
    })
  )
  return resolved
}

/* ================= Sync engine ================= */

let syncChain: Promise<void> = Promise.resolve()
let syncTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSync() {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    syncTimer = null
    void enqueue(pushLocalToShopify)
  }, 250)
}

function enqueue(task: () => Promise<void>): Promise<void> {
  syncChain = syncChain.then(task).catch((error) => {
    console.warn("Cart sync failed; will retry on next change or page load:", error)
  })
  return syncChain
}

function desiredQuantities(items: CartItem[]): Map<string, number> {
  const wanted = new Map<string, number>()
  for (const item of items) {
    if (!item.merchandiseId || item.quantity <= 0) continue
    wanted.set(item.merchandiseId, (wanted.get(item.merchandiseId) ?? 0) + item.quantity)
  }
  return wanted
}

function assertNoUserErrors(result: { userErrors?: { message: string }[] } | undefined, action: string) {
  const errors = result?.userErrors ?? []
  if (errors.length) throw new Error(`${action}: ${errors.map((e) => e.message).join("; ")}`)
}

// Make the Shopify cart match the local items exactly (idempotent: safe to run any number of times)
async function pushLocalToShopify() {
  let items = getCartItems()
  const resolved = await resolveMissingMerchandise(items)
  if (resolved.some((item, i) => item.merchandiseId !== items[i]?.merchandiseId)) {
    items = resolved
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {}
  }

  const wanted = desiredQuantities(items)
  const cartId = getShopifyCartId()
  const cart = cartId ? await cartQuery(cartId) : null

  if (!cart) {
    // No cart yet, or it expired / was completed
    if (wanted.size === 0) {
      setShopifyCartId(null)
    } else {
      const created = await cartCreate(
        Array.from(wanted, ([merchandiseId, quantity]) => ({ merchandiseId, quantity }))
      )
      if (!created?.id) throw new Error("cartCreate returned no cart")
      setShopifyCartId(created.id, created.checkoutUrl)
    }
    if (!syncTimer) setDirty(false)
    return
  }

  setShopifyCartId(cart.id, cart.checkoutUrl)
  const lines = cart.lines?.nodes ?? []
  const toUpdate: { id: string; quantity: number }[] = []
  const toRemove: string[] = []
  const seen = new Set<string>()

  for (const line of lines) {
    const merchandiseId = line?.merchandise?.id
    const target = merchandiseId && !seen.has(merchandiseId) ? wanted.get(merchandiseId) : undefined
    if (!target) {
      toRemove.push(line.id)
      continue
    }
    seen.add(merchandiseId)
    if (line.quantity !== target) toUpdate.push({ id: line.id, quantity: target })
  }
  const toAdd = Array.from(wanted)
    .filter(([merchandiseId]) => !seen.has(merchandiseId))
    .map(([merchandiseId, quantity]) => ({ merchandiseId, quantity }))

  if (toRemove.length) assertNoUserErrors(await cartLinesRemove(cart.id, toRemove), "cartLinesRemove")
  if (toUpdate.length) assertNoUserErrors(await cartLinesUpdate(cart.id, toUpdate), "cartLinesUpdate")
  if (toAdd.length) assertNoUserErrors(await cartLinesAdd(cart.id, toAdd), "cartLinesAdd")

  // Only clear the flag if nothing changed locally while we were syncing
  if (!syncTimer) setDirty(false)
}

async function pullShopifyToLocal() {
  const cartId = getShopifyCartId()
  if (!cartId) return
  const cart = await cartQuery(cartId)
  // The cart was replaced (e.g. by a recovery link) while this request was in flight: its result is stale
  if (getShopifyCartId() !== cartId) return
  if (!cart) {
    // Expired or already checked out on Shopify. Keep what the customer sees and rebuild a fresh cart from it.
    setShopifyCartId(null)
    if (getCartItems().length) await pushLocalToShopify()
    return
  }
  setShopifyCartId(cart.id, cart.checkoutUrl)
  // A local change made while this request was in flight wins; it will be pushed by its own sync
  if (isDirty() || syncTimer) return
  writeLocalItems(itemsFromShopifyCart(cart, getCartItems()))
  setDirty(false)
}

/** Waits until the Shopify cart reflects the local cart (used before checkout so the cart token is real). */
export async function ensureCartSynced(timeoutMs = 4000): Promise<string | null> {
  if (typeof window === "undefined") return null
  if (syncTimer) {
    clearTimeout(syncTimer)
    syncTimer = null
    void enqueue(pushLocalToShopify)
  } else if (isDirty() || (!getShopifyCartId() && getCartItems().length)) {
    void enqueue(pushLocalToShopify)
  }
  await Promise.race([syncChain, new Promise((resolve) => setTimeout(resolve, timeoutMs))])
  return getShopifyCartId()
}

/* ================= Cart links ================= */

function normalizeCartId(raw: string, key?: string | null): string {
  const value = raw.trim()
  if (value.startsWith("gid://shopify/Cart/")) {
    return key && !value.includes("?key=") ? `${value}?key=${key}` : value
  }
  return `gid://shopify/Cart/${value}${key ? `?key=${key}` : ""}`
}

async function replaceCartWith(items: CartItem[], cart: { id: string; checkoutUrl?: string } | null) {
  if (syncTimer) {
    clearTimeout(syncTimer)
    syncTimer = null
  }
  writeLocalItems(items)
  if (cart) {
    setShopifyCartId(cart.id, cart.checkoutUrl)
    setDirty(false)
  } else {
    // Built from variant IDs: create a fresh Shopify cart for it right away
    setShopifyCartId(null)
    setDirty(true)
    await enqueue(pushLocalToShopify)
  }
}

/** Restores a cart from its Shopify cart ID / token. Returns false if the cart no longer exists. */
export async function restoreCartFromId(rawId: string, key?: string | null): Promise<boolean> {
  const cart = await cartQuery(normalizeCartId(rawId, key))
  const items = cart ? itemsFromShopifyCart(cart, getCartItems()) : []
  if (!cart || !items.length) return false
  await replaceCartWith(items, cart)
  return true
}

/** Restores a cart from "variantId:qty" pairs, the Shopify cart-permalink format. */
export async function restoreCartFromLines(lines: { variantId: string; quantity: number }[]): Promise<boolean> {
  const ids = lines.map((l) =>
    l.variantId.startsWith("gid://") ? l.variantId : `gid://shopify/ProductVariant/${l.variantId}`
  )
  const variants = await fetchVariantsByIds(ids)
  const items = lines
    .map((line, i) => {
      const variant = (variants as ShopifyVariant[]).find((v) => v.id === ids[i])
      return variant ? itemFromVariant(variant, Math.max(1, line.quantity)) : null
    })
    .filter((item): item is CartItem => item !== null)
  if (!items.length) return false
  await replaceCartWith(items, null)
  return true
}

/* ================= Startup ================= */

let initPromise: Promise<void> | null = null

/** Called once per page load: reconciles the local cart with Shopify. */
export function initCart(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (initPromise) return initPromise

  initPromise = (async () => {
    // Shared cart link on any page: /anything?cart=<id>[&key=...]
    const params = new URLSearchParams(window.location.search)
    const linked = params.get("cart")
    if (linked) {
      const restored = await restoreCartFromId(linked, params.get("key")).catch(() => false)
      params.delete("cart")
      params.delete("key")
      const query = params.toString()
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`)
      if (restored) return
    }
    await enqueue(isDirty() ? pushLocalToShopify : pullShopifyToLocal)
  })()

  // Re-check when the customer comes back to an open tab (another tab or device may have changed the cart)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !isDirty() && !syncTimer) void enqueue(pullShopifyToLocal)
  })

  return initPromise
}

/** After a completed order: empty the cart everywhere. */
export function clearCart() {
  if (typeof window === "undefined") return
  setShopifyCartId(null)
  setDirty(false)
  writeLocalItems([])
}

/* ================= Customer actions ================= */

export function addToCart(
  item: Omit<CartItem, "quantity">,
  options: { openCart?: boolean } = { openCart: true }
) {
  const items = getCartItems()
  const existing = items.find((i) => i.id === item.id && i.size === item.size)
  if (existing) {
    existing.quantity += 1
  } else {
    items.push({ ...item, quantity: 1 })
  }
  saveCartItems(items)

  window.dispatchEvent(
    new CustomEvent("cart-updated", {
      detail: options.openCart !== false ? { open: true, addedItem: item } : { open: false },
    })
  )
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
  saveCartItems(getCartItems().filter((i) => !(i.id === id && i.size === size)))
}

/* ================= Checkout ================= */

function withDiscount(url: string, code: string | null | undefined) {
  return code ? `${url}${url.includes("?") ? "&" : "?"}discount=${encodeURIComponent(code)}` : url
}

export async function buyNow(
  item: Omit<CartItem, "quantity"> & { quantity?: number },
  options?: { couponCode?: string }
): Promise<string | null> {
  if (typeof window === "undefined") return null

  const checkoutDomain = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || "checkout.clarteclub.in"
  const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
  const discountCode = options?.couponCode || getAppliedCoupon()

  // Buy Now is a separate single-item cart: it never touches the customer's saved cart
  const [resolved] = await resolveMissingMerchandise([{ ...item, quantity }])
  const merchandiseId = resolved.merchandiseId
  if (!merchandiseId) {
    alert("This product could not be prepared for checkout. Please try again.")
    return null
  }

  try {
    const cart = await cartCreate([{ merchandiseId, quantity }])
    if (cart?.checkoutUrl) {
      const finalUrl = withDiscount(cart.checkoutUrl, discountCode)
      window.location.href = finalUrl
      return finalUrl
    }
  } catch (error) {
    console.warn("Shopify cartCreate failed for Buy Now:", error)
  }

  const numericId = merchandiseId.replace(/^.*\/ProductVariant\//, "")
  const permalinkUrl = withDiscount(`https://${checkoutDomain}/cart/${numericId}:${quantity}`, discountCode)
  window.location.href = permalinkUrl
  return permalinkUrl
}

export async function processShopifyCheckout(discountCode?: string): Promise<string | null> {
  if (typeof window === "undefined") return null

  const items = getCartItems()
  if (items.length === 0) {
    alert("Your cart is empty.")
    return null
  }

  const checkoutDomain = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || "checkout.clarteclub.in"
  const coupon = discountCode || getAppliedCoupon()

  // Check out the customer's own synced cart (not a throwaway copy), so recovery points at the same cart
  const cartId = await ensureCartSynced()
  const cart = cartId ? await cartQuery(cartId).catch(() => null) : null
  if (cart?.checkoutUrl) {
    const finalUrl = withDiscount(cart.checkoutUrl, coupon)
    window.location.href = finalUrl
    return finalUrl
  }

  // Fallback: Shopify cart permalink built from the cart's variants
  const permalinkParts = Array.from(desiredQuantities(getCartItems()), ([merchandiseId, quantity]) =>
    `${merchandiseId.replace(/^.*\/ProductVariant\//, "")}:${quantity}`
  )
  if (permalinkParts.length === 0) {
    alert("Your cart could not be prepared for checkout. Please try again.")
    return null
  }
  const permalinkUrl = withDiscount(`https://${checkoutDomain}/cart/${permalinkParts.join(",")}`, coupon)
  window.location.href = permalinkUrl
  return permalinkUrl
}
