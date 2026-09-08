"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, X, Loader2 } from "lucide-react"

import { CartOfferProgress } from "@/components/cart/CartOfferProgress"
import { trendingProducts } from "@/components/product/productData"
import { CartRecommendationsCarousel } from "@/components/cart/CartRecommendationsCarousel"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

import { getCartItems, updateCartQuantity, removeFromCart, processShopifyCheckout, type CartItem } from "@/lib/cart"

const promoStripText = "Additional Discount on Pre-paid | Free Return and Exchange"

const recommendations: Array<{ id: string; image: string; alt: string }> = []

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <article className="grid grid-cols-[90px_minmax(0,1fr)] gap-4 p-3 bg-white border border-black/10 rounded-lg shadow-sm">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efefef] border border-black/5 rounded">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="90px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[0.85rem] font-semibold uppercase leading-[1.2] tracking-[0.08em] text-[#0F0F10]">
              {item.title}
            </h3>

            <div className="mt-1.5 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.06em] text-neutral-500 font-medium">
              <span>SIZE: <span className="text-black font-semibold">{item.size}</span></span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.size)}
            aria-label={`Remove ${item.title}`}
            className="text-neutral-400 hover:text-black transition-colors p-1 cursor-pointer"
          >
            <X className="size-4 stroke-[1.8]" />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-2.5">
          <div className="flex items-center gap-2 text-[0.8rem] leading-none border border-black/20 rounded bg-white px-1.5 py-0.5">
            <button
              type="button"
              onClick={() => updateCartQuantity(item.id, item.size, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="text-neutral-600 hover:text-black transition-colors px-1 cursor-pointer font-bold"
            >
              -
            </button>
            <span className="font-semibold text-[#0F0F10] px-1">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateCartQuantity(item.id, item.size, item.quantity + 1)}
              aria-label="Increase quantity"
              className="text-neutral-600 hover:text-black transition-colors px-1 cursor-pointer font-bold"
            >
              +
            </button>
          </div>

          <p className="text-[0.85rem] font-extrabold tracking-[0.08em] text-[#0F0F10]">
            {item.price}
          </p>
        </div>
      </div>
    </article>
  )
}

function PromoMarqueeRow() {
  return (
    <div className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#0F0F10]">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={`promo-${index}`} className="whitespace-nowrap">
          {promoStripText}
        </span>
      ))}
    </div>
  )
}

type CartSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCheckingOut, setIsCheckingOut] = useState(false)

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

  useEffect(() => {
    setCartItems(getCartItems())

    const handleCartUpdated = () => {
      setCartItems(getCartItems())
    }

    window.addEventListener("cart-updated", handleCartUpdated)
    return () => window.removeEventListener("cart-updated", handleCartUpdated)
  }, [])

  useEffect(() => {
    if (open) {
      (window as any).lenis?.stop()
      if (window.location.hash) {
        try {
          const state = typeof window.history.state === "object" && window.history.state !== null 
            ? window.history.state 
            : {};
          window.history.replaceState(state, document.title, window.location.pathname + window.location.search);
        } catch (err) {
          console.error("Failed to clear hash safely in CartSidebar:", err);
        }
      }
    } else {
      (window as any).lenis?.start()
    }
    return () => {
      (window as any).lenis?.start()
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="!z-[10000] bg-black/40 backdrop-blur-[1px]"
        className="!z-[10001] overflow-hidden border-l border-black/10 bg-[#fcfbfa] p-0 text-[#0F0F10] shadow-[0_0_80px_rgba(0,0,0,0.15)] ease-in-out duration-300"
        style={{ width: "min(100vw, 420px)", maxWidth: "none" }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 bg-[#f4f4f4]">
            <div className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-[#0F0F10]">
              <Check className="size-4 stroke-[2.4] text-[#C9B07A]" />
              <span>{cartItems.length} {cartItems.length === 1 ? "ITEM" : "ITEMS"} ADDED</span>
            </div>

            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-neutral-600 hover:text-black transition-colors cursor-pointer leading-none"
              >
                <span className="leading-none">CLOSE</span>
                <X className="size-4 stroke-[1.8] shrink-0 relative -top-[0.5px]" />
              </button>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Your cart items, offers, recommendations, and checkout actions.
          </SheetDescription>

          {/* Offer Progress */}
          <div className="flex-none px-5 py-4 bg-[#f4f4f4] border-b border-black/10">
            <CartOfferProgress dark={false} />
          </div>

          {/* Cart Items List */}
          <div
            data-lenis-prevent
            className="cart-item-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#fcfbfa]"
          >
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-sm">
                Your cart is currently empty.
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItemRow key={`scroll-${item.id}`} item={item} />
              ))
            )}
          </div>

          {/* Footer Area */}
          <div className="flex-none bg-[#f4f4f4] border-t border-black/10">
            {/* Marquee Banner */}
            <div className="overflow-hidden bg-[#ebe8e1] border-b border-black/10 px-3 py-1.5 text-[#0F0F10]">
              <div className="flex w-max items-center animate-[marquee_18s_linear_infinite] motion-reduce:animate-none [will-change:transform]">
                <PromoMarqueeRow />
                <PromoMarqueeRow />
              </div>
            </div>

            {/* Recommendations & Checkout */}
            <div className="px-5 py-4 bg-[#f4f4f4]">
              <CartRecommendationsCarousel items={recommendations} dark={false} />

              <div className="mt-5 pb-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || cartItems.length === 0}
                  className="flex h-12 w-full items-center justify-center bg-[#0F0F10] text-[#fcfbfa] text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-[#C9B07A] hover:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isCheckingOut ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-[#C9B07A]" />
                      REDIRECTING TO CHECKOUT...
                    </span>
                  ) : (
                    "CHECKOUT"
                  )}
                </button>

                <Link
                  href="/cart"
                  onClick={() => onOpenChange(false)}
                  className="mt-3 block text-center text-[10.5px] font-semibold uppercase tracking-[0.16em] text-neutral-600 hover:text-black underline underline-offset-4 transition-colors"
                >
                  View Shopping Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
