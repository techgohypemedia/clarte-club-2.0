"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Check,
  CreditCard,
  Heart,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Tag,
  Copy,
  Sun,
  Layers,
} from "lucide-react"
import type { ButtonHTMLAttributes } from "react"
import { useState, useEffect } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ProductDetail, ProductCoupon } from "@/components/product/productData"
import { addToCart, buyNow } from "@/lib/cart"
import { useWishlist } from "@/lib/wishlist"

const deliveryIcons = {
  truck: Truck,
  exchange: RefreshCcw,
  shield: ShieldCheck,
  card: CreditCard,
} as const

function OptionButton({
  active,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center border text-[14px] font-medium leading-normal transition-[background-color,border-color,color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45 cursor-pointer",
        active
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black hover:border-black hover:bg-black/4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProductSummary({
  product,
}: {
  product: ProductDetail
}) {
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || ""
  )

  // Shopify titles are "Collection / Frame" (e.g. "Atelier / Cobalt Muse"): show the collection as the small label
  const [titleCollection, titleFrame] = product.title.includes("/")
    ? product.title.split("/").map((part) => part.trim())
    : [product.editLabel, product.title]
  const collectionLabel = titleCollection || product.editLabel
  const frameName = titleFrame || product.title

  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle")
  const [isBuying, setIsBuying] = useState(false)
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id) || isInWishlist(product.slug)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>(null)
  
  // Coupon copy, dialog, and cross-sell states
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null)
  const [isViewAllCouponsOpen, setIsViewAllCouponsOpen] = useState(false)
  const [addedFitItems, setAddedFitItems] = useState<{ case: boolean; frame: boolean }>({
    case: false,
    frame: false,
  })

  const availableCoupons: ProductCoupon[] = product.coupons || []

  const handleAddToCart = () => {
    setCartState("adding")
    addToCart({
      id: product.slug,
      merchandiseId: product.merchandiseId,
      image: product.gallery[0]?.src || "/images/products/product1.png",
      alt: product.gallery[0]?.alt || product.title,
      title: product.title,
      size: selectedSize,
      price: product.price,
    })
    setTimeout(() => {
      setCartState("added")
      setTimeout(() => {
        setCartState("idle")
      }, 1500)
    }, 850)
  }

  const handleBuyNow = async () => {
    if (isBuying) return
    setIsBuying(true)

    const timer = setTimeout(() => {
      setIsBuying(false)
    }, 3000)

    try {
      await buyNow({
        id: product.slug,
        merchandiseId: product.merchandiseId,
        image: product.gallery[0]?.src || "/images/products/product1.png",
        alt: product.gallery[0]?.alt || product.title,
        title: product.title,
        size: selectedSize,
        price: product.price,
      })
    } catch (err) {
      console.error("Buy Now error:", err)
      clearTimeout(timer)
      setIsBuying(false)
    }
  }

  useEffect(() => {
    const resetBuying = () => setIsBuying(false)
    window.addEventListener("pageshow", resetBuying)
    window.addEventListener("focus", resetBuying)
    return () => {
      window.removeEventListener("pageshow", resetBuying)
      window.removeEventListener("focus", resetBuying)
    }
  }, [])

  const handleCopyCoupon = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(code)
      setCopiedCouponCode(code)
      setTimeout(() => {
        setCopiedCouponCode(null)
      }, 2000)
    }
  }

  const toggleFitItem = (item: "case" | "frame") => {
    setAddedFitItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }))
  }

  return (
    <aside className="self-start w-full">
      <div className="space-y-5 text-black lg:w-full lg:max-w-[480px] xl:max-w-[573px] lg:justify-self-end">
        {/* COLLECTION + NAME ("Atelier / Cobalt Muse" -> ATELIER above COBALT MUSE) */}
        <div className="space-y-2">
          <p className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.32em] text-[#C9B07A]">
            {collectionLabel}
          </p>
          <h1 className="font-heading text-[32px] sm:text-[38px] md:text-[44px] font-normal uppercase leading-[0.95] tracking-[-0.04em]">
            {frameName}
          </h1>
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="text-[16px] sm:text-[18px] leading-none text-black/40 line-through">
              {product.originalPrice}
            </span>
            <span className="font-heading text-[22px] sm:text-[26px] font-medium leading-none tracking-[-0.03em] text-black">
              {product.price}
            </span>
            <span className="inline-flex items-center border border-black/70 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] leading-none text-black">
              Limited Stock
            </span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-black/45 uppercase tracking-[0.16em]">Incl. of all taxes</p>
        </div>

        {/* PREPAID OFFER */}
        <div className="inline-flex w-fit items-center gap-1.5 border border-black/10 px-2.5 py-1 sm:px-3 text-black">
          <Tag className="size-3 shrink-0 text-[#C9B07A]" />
          <span className="text-[10px] min-[360px]:text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.12em]">
            10% off on prepaid orders
          </span>
        </div>

        {/* HALLMARKS */}
        <div className="grid grid-cols-2 border-y border-black/10 py-4">
          <div className="flex items-center gap-3 pr-3">
            <Sun className="size-7 shrink-0 text-black" strokeWidth={1.2} />
            <div className="min-w-0 leading-tight">
              <p className="whitespace-nowrap text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.14em] text-black">UV 400</p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-black/50">Protection</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l border-black/10 pl-4">
            <Layers className="size-7 shrink-0 text-black" strokeWidth={1.2} />
            <div className="min-w-0 leading-tight">
              <p className="whitespace-nowrap text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.14em] text-black">Premium-grade</p>
              <p className="mt-0.5 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-black/50">Materials</p>
            </div>
          </div>
        </div>

        {/* PRIMARY CTA: above the description so it is visible without scrolling on phones */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cartState !== "idle" || isBuying}
              className={cn(
                "flex h-12 flex-1 items-center justify-center border border-black text-[14px] sm:text-[16px] md:text-[17px] font-medium uppercase tracking-[0.14em] transition-all duration-200 ease-out cursor-pointer",
                cartState === "idle" && "bg-white text-black hover:bg-black hover:text-white",
                cartState === "adding" && "bg-black/10 text-black/40 border-black/10 cursor-not-allowed",
                cartState === "added" && "bg-[#5b8c38] text-white border-[#5b8c38]"
              )}
            >
              {cartState === "idle" && "Add To Cart"}
              {cartState === "adding" && "Adding..."}
              {cartState === "added" && "Added To Bag ✓"}
            </button>
            <button
              type="button"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => {
                toggleWishlist({
                  id: product.id || product.slug,
                  handle: product.slug,
                  title: product.title || product.name || "Signature Frame",
                  price: product.price,
                  image: product.gallery?.[0]?.src || product.image || "/images/products/product1.png",
                  alt: product.title || product.name || "Product image",
                  inStock: product.inStock,
                  merchandiseId: product.merchandiseId,
                })
              }}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center border transition-all duration-200 cursor-pointer",
                isWishlisted
                  ? "border-[#C9B07A] bg-black text-[#C9B07A]"
                  : "border-black/20 bg-white text-black hover:border-black"
              )}
            >
              <Heart
                className="size-5 transition-transform duration-200 active:scale-125"
                style={{
                  fill: isWishlisted ? "currentColor" : "none",
                  strokeWidth: 1.8,
                }}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isBuying}
            className={cn(
              "flex h-12 w-full items-center justify-center border border-black bg-black text-[14px] sm:text-[16px] md:text-[17px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity duration-200 ease-out hover:bg-black/85 cursor-pointer shadow-sm active:scale-[0.99]",
              isBuying && "opacity-50 pointer-events-none"
            )}
          >
            Buy Now
          </button>

        </div>

        {/* DESCRIPTION */}
        <section>
          <p className="max-w-[38rem] font-sans text-[14px] sm:text-[15px] font-normal leading-[1.75] text-black/70">
            {isDescExpanded || product.description.length <= 220
              ? product.description
              : `${product.description.slice(0, 220)}... `}
            {product.description.length > 220 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setIsDescExpanded((prev) => !prev)
                }}
                className="font-semibold text-black underline underline-offset-4 transition-opacity hover:opacity-70 cursor-pointer inline-block ml-1"
              >
                {isDescExpanded ? "See Less" : "See More..."}
              </button>
            )}
          </p>
        </section>



        {/* AVAILABLE COUPONS */}
        {availableCoupons.length > 0 && (
          <>
            <section className="space-y-3 pt-4 border-t border-black/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="size-3.5 text-black" />
                  <h3 className="text-[13px] font-semibold uppercase tracking-wider text-black">
                    Available Coupons
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsViewAllCouponsOpen(true)}
                  className="text-[11px] uppercase text-black/50 hover:text-black hover:underline tracking-wider font-medium cursor-pointer"
                >
                  View All ({availableCoupons.length})
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none w-full min-w-0">
                {availableCoupons.map((coupon) => {
                  const isCopied = copiedCouponCode === coupon.code

                  return (
                    <div
                      key={coupon.code}
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={cn(
                        "group relative flex items-center justify-between gap-3 shrink-0 w-[260px] border p-3 bg-white transition-all cursor-pointer select-none",
                        isCopied
                          ? "border-black shadow-sm bg-neutral-50/80"
                          : "border-black/10 hover:border-black/30"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/5 text-black group-hover:bg-black group-hover:text-white transition-colors"
                        >
                          {coupon.badge || (coupon.code.includes("300") ? "FLAT" : coupon.code.includes("BELT") ? "GET" : "OFF")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11.5px] font-bold uppercase tracking-wider text-black truncate">
                            {coupon.title || `CODE: ${coupon.code}`}
                          </p>
                          <p className="text-[9.5px] text-black/50 uppercase leading-tight mt-0.5 truncate">
                            {isCopied ? (
                              <span className="text-[#3b7a27] font-semibold flex items-center gap-1">
                                Code Copied ✓
                              </span>
                            ) : (
                              `Code: ${coupon.code}`
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          title="Copy code"
                          onClick={(e) => handleCopyCoupon(coupon.code, e)}
                          className="p-1.5 text-black/40 hover:text-black transition-colors rounded hover:bg-black/5 cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="size-3.5 text-[#3b7a27]" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* VIEW ALL COUPONS DIALOG */}
            <Dialog open={isViewAllCouponsOpen} onOpenChange={setIsViewAllCouponsOpen}>
              <DialogContent className="max-w-md bg-white p-6 border border-black/15 shadow-2xl rounded-none">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="font-heading text-xl uppercase tracking-tight text-black">
                    Available Coupons &amp; Offers
                  </DialogTitle>
                  <DialogDescription className="text-[12px] text-black/60 uppercase tracking-wider">
                    Copy a coupon code to use at checkout.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {availableCoupons.map((coupon) => {
                    const isCopied = copiedCouponCode === coupon.code

                    return (
                      <div
                        key={coupon.code}
                        className={cn(
                          "border p-4 transition-all flex flex-col gap-3",
                          isCopied
                            ? "border-black bg-neutral-50 shadow-sm"
                            : "border-black/10 hover:border-black/30 bg-white"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold uppercase">
                              {coupon.badge || "OFF"}
                            </span>
                            <div>
                              <h4 className="text-[13px] font-bold uppercase tracking-wider text-black">
                                {coupon.title}
                              </h4>
                              {coupon.description && (
                                <p className="text-[11.5px] text-black/60 mt-0.5 leading-normal">
                                  {coupon.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-1">
                          <div className="flex items-center gap-2 bg-black/5 px-2.5 py-1.5 rounded border border-black/10">
                            <span className="font-mono text-[12px] font-bold text-black uppercase tracking-widest">
                              {coupon.code}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleCopyCoupon(coupon.code, e)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded",
                              isCopied
                                ? "bg-[#3b7a27] text-white"
                                : "bg-black text-white hover:bg-neutral-800"
                            )}
                          >
                            {isCopied ? (
                              <>
                                <Check className="size-3 text-white" />
                                <span>Copied ✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3 text-white" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}



        {/* ACCORDIONS: product details live under Details & Care (no separate repeated block) */}
        <div className="border-t border-black/10">
          <div className="border-b border-black/10">
            <button
              type="button"
              id="details"
              aria-expanded={activeAccordion === "care"}
              onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
              className="flex w-full items-center justify-between py-4 text-[12.5px] sm:text-[13px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70 cursor-pointer"
            >
              <span>Details &amp; Care</span>
              <span className="text-[18px] font-light leading-none">{activeAccordion === "care" ? "−" : "+"}</span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                activeAccordion === "care" ? "max-h-300 pb-5" : "max-h-0"
              )}
            >
              {typeof product.detailsBody === "string" && product.detailsBody.includes("<") ? (
                <div
                  className="max-w-xl font-sans text-[14px] sm:text-[15px] leading-[1.7] text-black/70 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_em]:italic [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: product.detailsBody }}
                />
              ) : product.detailsBody && product.detailsBody !== product.description ? (
                <p className="max-w-xl font-sans text-[14px] sm:text-[15px] leading-[1.7] text-black/70">{product.detailsBody}</p>
              ) : null}
              {product.careNotes.length > 0 ? (
                <ul className="mt-3 list-disc pl-5 space-y-1.5 text-[14px] sm:text-[15px] leading-relaxed text-black/70">
                  {product.careNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="border-b border-black/10">
            <button
              type="button"
              aria-expanded={activeAccordion === "shipping"}
              onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
              className="flex w-full items-center justify-between py-4 text-[12.5px] sm:text-[13px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70 cursor-pointer"
            >
              <span>Shipping &amp; Exchanges</span>
              <span className="text-[18px] font-light leading-none">{activeAccordion === "shipping" ? "−" : "+"}</span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                activeAccordion === "shipping" ? "max-h-200 pb-5" : "max-h-0"
              )}
            >
              <ul className="list-disc pl-5 space-y-1.5 text-[14px] sm:text-[15px] leading-relaxed text-black/70">
                {product.shippingNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* TRUST BADGES */}
        <section className="pt-2 pb-2">
          <div className="grid grid-cols-3 divide-x divide-black/10">
            {[
              { icon: Truck,        label: 'Free Shipping', sub: 'On orders above ₹999'  },
              { icon: RefreshCcw,   label: 'Easy Exchange', sub: '7-day exchange policy' },
              { icon: ShieldCheck,  label: 'Secure Pay',    sub: '100% safe checkout'    },
            ].map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.label}
                  className="flex flex-col items-center justify-center gap-1.5 px-1 py-1 text-center"
                >
                  <Icon className="size-4 shrink-0 text-black/60" strokeWidth={1.5} />
                  <div className="space-y-0.5">
                    <p className="text-[8.5px] font-bold uppercase tracking-[0.06em] text-black leading-tight">
                      {badge.label}
                    </p>
                    <p className="text-[7.5px] uppercase tracking-wide text-black/40 font-light leading-tight">
                      {badge.sub}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </aside>
  )
}
