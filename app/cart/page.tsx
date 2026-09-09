"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check, X, ShieldCheck, Truck, RefreshCw, Loader2, ShoppingBag } from "lucide-react"

import { ProductCardView } from "@/components/home/TrendingSection"
import { CartOfferProgress } from "@/components/cart/CartOfferProgress"
import { trendingProducts, type ProductCard } from "@/components/product/productData"
import { getCartItems, updateCartQuantity, removeFromCart, processShopifyCheckout, type CartItem } from "@/lib/cart"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<ProductCard[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    setCartItems(getCartItems())

    const handleCartUpdated = () => {
      setCartItems(getCartItems())
    }

    window.addEventListener("cart-updated", handleCartUpdated)

    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(4).then((products) => {
        if (isMounted && products && products.length > 0) {
          setRecommendedProducts(products)
        }
      })
    })

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated)
      isMounted = false
    }
  }, [])

  const handleCheckout = async () => {
    if (isCheckingOut) return
    setIsCheckingOut(true)
    try {
      await processShopifyCheckout()
    } catch (err) {
      console.error("Checkout error:", err)
    } finally {
      setIsCheckingOut(false)
    }
  }

  const parsePrice = (priceStr: string): number => {
    const numeric = priceStr.replace(/[^0-9.]/g, "")
    return parseFloat(numeric) || 0
  }

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <main className="min-h-screen bg-[#fcfbfa] text-[#0F0F10] font-sans">
      {/* 1. Header Section */}
      <section className="w-full px-5 sm:px-12 md:px-20 pt-6 sm:pt-10 pb-8 border-b border-black/10 bg-[#fcfbfa]">
        <div className="mx-auto max-w-7xl relative">
          {/* Top Left Continue Shopping Button */}
          <div className="mb-4 sm:mb-0 sm:absolute sm:left-0 sm:top-1.5">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors group"
            >
              <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Centered Heading Content (Collection Page Style) */}
          <div className="space-y-3 text-center flex flex-col items-center justify-center pt-1 sm:pt-0">
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] uppercase font-semibold tracking-[0.25em] text-neutral-500">
              <Link href="/" className="hover:text-black transition-colors">
                Homepage
              </Link>
              <span>/</span>
              <span className="text-[#0F0F10]">Shopping Cart</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold uppercase leading-none tracking-[-0.03em] text-[#0F0F10] text-center">
              YOUR SHOPPING CART
            </h1>

            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F0F10] shadow-sm">
                <ShoppingBag className="size-3.5 text-[#C9B07A]" />
                <span>{totalItemCount} {totalItemCount === 1 ? "ITEM" : "ITEMS"}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Cart Content Grid */}
      <section className="w-full px-5 sm:px-12 md:px-20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {cartItems.length === 0 ? (
            /* EMPTY CART VIEW */
            <div className="mx-auto max-w-2xl text-center py-16 px-6 bg-[#f4f4f4] border border-black/10 rounded-lg shadow-sm">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white border border-black/10 text-neutral-400 mb-4">
                <ShoppingBag className="size-8" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#0F0F10]">
                Your Shopping Cart is Empty
              </h2>
              <p className="mt-2 text-[13px] text-neutral-600 max-w-md mx-auto leading-relaxed">
                Explore our signature architectural eyewear collections and curated drops.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#new-drops"
                  className="w-full sm:w-auto px-8 h-12 inline-flex items-center justify-center bg-[#0F0F10] text-[#fcfbfa] text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-[#C9B07A] hover:text-black transition-colors shadow-sm"
                >
                  Explore New Drops
                </Link>
                <Link
                  href="/collections"
                  className="w-full sm:w-auto px-8 h-12 inline-flex items-center justify-center border border-black/20 bg-white text-[#0F0F10] text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-neutral-100 transition-colors"
                >
                  View Collections
                </Link>
              </div>
            </div>
          ) : (
            /* FULL VIEW LAYOUT WITH ITEMS */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Cart Progress & Items List */}
              <div className="lg:col-span-8 space-y-8">
                {/* Offer Progress Box */}
                <div className="bg-[#f4f4f4] border border-black/10 p-6 sm:p-8 rounded-lg shadow-sm">
                  <CartOfferProgress dark={false} />
                </div>

                {/* Items Header */}
                <div className="flex items-center justify-between border-b border-black/10 pb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Product Details
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                    Subtotal
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article
                      key={`${item.id}-${item.size}`}
                      className="grid grid-cols-[100px_minmax(0,1fr)] sm:grid-cols-[130px_minmax(0,1fr)] gap-5 sm:gap-6 p-4 sm:p-6 bg-white border border-black/10 rounded-lg shadow-sm transition-all hover:border-black/20"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efefef] border border-black/5 rounded">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 640px) 100px, 130px"
                          className="object-cover object-center"
                        />
                      </div>

                      {/* Details & Actions */}
                      <div className="flex min-w-0 flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9B07A]">
                                CLARTÉ EYWEAR
                              </span>
                              <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wide text-[#0F0F10] truncate mt-0.5">
                                {item.title}
                              </h3>
                              <p className="mt-1 text-[12px] text-neutral-500 font-medium">
                                SIZE: <span className="text-black font-semibold">{item.size}</span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer"
                              aria-label={`Remove ${item.title}`}
                            >
                              <X className="size-4 stroke-[2]" />
                            </button>
                          </div>
                        </div>

                        {/* Bottom Row: Quantity & Price */}
                        <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">
                          <div className="flex items-center border border-black/20 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
                              className="flex size-8 items-center justify-center text-[14px] font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="flex h-8 min-w-[32px] items-center justify-center px-2 text-[13px] font-semibold text-[#0F0F10]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
                              className="flex size-8 items-center justify-center text-[14px] font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm sm:text-base font-bold tracking-wider text-[#0F0F10]">
                              {item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Right Column: Order Summary Sidebar */}
              <div className="lg:col-span-4 sticky top-24 space-y-6">
                <div className="bg-[#f4f4f4] border border-black/10 p-6 sm:p-8 rounded-lg shadow-sm space-y-6">
                  <h2 className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#0F0F10] border-b border-black/10 pb-4">
                    ORDER SUMMARY
                  </h2>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold uppercase tracking-wider text-neutral-700">Subtotal ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})</span>
                    <span className="text-lg font-extrabold tracking-wider text-[#0F0F10]">
                      ₹ {subtotal ? subtotal.toLocaleString("en-IN") : "4,500"}
                    </span>
                  </div>

                  {/* Pre-paid discount highlight */}
                  <div className="rounded bg-[#ebe8e1] border border-black/10 p-3.5 text-center">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-[#0F0F10]">
                      Additional Discount Available on Pre-Paid Orders
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cartItems.length === 0}
                    className="flex h-14 w-full items-center justify-center bg-[#0F0F10] text-[#fcfbfa] text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-[#C9B07A] hover:text-black disabled:opacity-50 cursor-pointer shadow-md mt-2"
                  >
                    {isCheckingOut ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-[#C9B07A]" />
                        REDIRECTING TO CHECKOUT...
                      </span>
                    ) : (
                      "PROCEED TO CHECKOUT"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Recommended Products Section */}
      {cartItems.length > 0 && (
        <section className="w-full px-5 sm:px-12 md:px-20 py-14 border-t border-black/10 bg-[#f4f4f4]">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-10 space-y-2">
              <span className="text-[10.5px] uppercase font-semibold tracking-[0.25em] text-neutral-500">
                Curated Recommendations
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0F0F10]">
                YOU MAY ALSO LIKE
              </h2>
              <div className="mx-auto h-[1px] w-16 bg-black/15 pt-1" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((product) => (
                <ProductCardView key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
