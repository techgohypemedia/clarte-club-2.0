"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Check,
  CreditCard,
  Heart,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react"
import type { ButtonHTMLAttributes } from "react"
import { useState, useEffect, useId } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/components/product/productData"
import { addToCart, buyNow } from "@/lib/cart"

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

function StarIcon({ filled, half }: { filled: boolean; half: boolean }) {
  const gradId = useId()
  return (
    <svg
      className={`h-4.5 w-4.5 ${filled ? "text-black fill-black" : half ? "text-black/50" : "text-black/15"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {half ? (
        <>
          <defs>
            <linearGradient id={gradId}>
              <stop offset="50%" stopColor="black" />
              <stop offset="50%" stopColor="#efefef" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#${gradId})`}
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </>
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  )
}

export function ProductSummary({
  product,
}: {
  product: ProductDetail
}) {
  const [selectedColor, setSelectedColor] = useState(product.colorName)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] ?? product.sizes[0]
  )
  const [reviewsCount, setReviewsCount] = useState(5)
  const [averageRating, setAverageRating] = useState(4.8)
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle")
  const [isBuying, setIsBuying] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<"care" | "shipping" | null>(null)
  
  // Coupon and cross-sell states
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [addedFitItems, setAddedFitItems] = useState<{ case: boolean; frame: boolean }>({
    case: false,
    frame: false,
  })

  // Fetch reviews count from local storage to display next to the star ratings
  useEffect(() => {
    const key = `clarte_reviews_${product.slug}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const totalRating = parsed.reduce((sum: number, r: any) => sum + Number(r.rating || 5), 0) + 24
          const totalCount = parsed.length + 5
          setReviewsCount(totalCount)
          setAverageRating(Number((totalRating / totalCount).toFixed(1)))
        }
      } catch (e) {
        // fallback to defaults
      }
    }
  }, [product.slug])

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



  const handleApplyCoupon = (code: string) => {
    if (appliedCoupon === code) {
      setAppliedCoupon(null)
    } else {
      setAppliedCoupon(code)
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
        {/* RATINGS & REVIEWS AT THE TOP */}
        <div className="space-y-2">
          <button
            onClick={() => {
              document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-1.5 text-black hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = averageRating >= star
                const isHalf = !isFilled && averageRating >= star - 0.5
                return (
                  <StarIcon key={star} filled={isFilled} half={isHalf} />
                )
              })}
            </div>
            <span className="text-[11px] sm:text-[13px] font-semibold tracking-[0.06em] text-black/50 uppercase">
              {averageRating} ({reviewsCount} REVIEWS)
            </span>
          </button>

          <div className="space-y-1">
            <p className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#C9B07A]">
              {product.editLabel}
            </p>
            <h1 className="font-heading text-[28px] sm:text-[34px] md:text-[40px] font-normal uppercase leading-[0.9] tracking-[-0.06em]">
              {product.title}
            </h1>
          </div>
        </div>

        {/* PRICE BLOCK WITH SOLD BADGE AND TAXES */}
        <div className="space-y-1.5 border-b border-black/10 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[15px] sm:text-[18px] leading-none text-black/45 line-through">
              {product.originalPrice}
            </span>
            <span className="font-heading text-[20px] sm:text-[24px] font-medium leading-none tracking-[-0.04em] text-black">
              {product.price}
            </span>
            <span className="inline-flex items-center justify-center bg-black text-white px-2.5 py-1 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider leading-none">
              1,238 Sold Today
            </span>
          </div>
          <p className="text-[8px] sm:text-[9px] text-black/40 uppercase tracking-wider font-light">
            INCL. OF ALL TAXES
          </p>
        </div>

        {/* DESCRIPTION BLOCK */}
        <section className="space-y-2">
          <p className="text-[13px] sm:text-[14px] md:text-[15px] font-bold uppercase tracking-wider text-black">
            Description:
          </p>
          <p className="max-w-[38rem] font-sans text-[13.5px] sm:text-[15px] font-normal leading-[1.75] text-black/75">
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
        <section className="space-y-3 pt-4 border-t border-black/15">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-black">
              Available Coupons
            </h3>
            <button className="text-[11px] uppercase text-black/45 hover:underline tracking-wider">
              View All
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none w-full min-w-0">
            {/* Coupon 1 */}
            <div 
              onClick={() => handleApplyCoupon("CLARTE300")}
              className={cn(
                "flex items-center gap-3 shrink-0 w-[240px] border p-3 bg-white transition-all cursor-pointer select-none",
                appliedCoupon === "CLARTE300" ? "border-black shadow-sm" : "border-black/10 hover:border-black/30"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold uppercase">
                FLAT
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black">
                  FLAT ₹300 OFF
                </p>
                <p className="text-[9px] text-black/50 uppercase leading-none mt-0.5">
                  {appliedCoupon === "CLARTE300" ? "Coupon Applied ✓" : "Code: CLARTE300"}
                </p>
              </div>
            </div>

            {/* Coupon 2 */}
            <div 
              onClick={() => handleApplyCoupon("FREEBELT")}
              className={cn(
                "flex items-center gap-3 shrink-0 w-[240px] border p-3 bg-white transition-all cursor-pointer select-none",
                appliedCoupon === "FREEBELT" ? "border-black shadow-sm" : "border-black/10 hover:border-black/30"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white text-[9px] font-bold uppercase">
                GET
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-black">
                  FREE PREMIUM BELT
                </p>
                <p className="text-[9px] text-black/50 uppercase leading-none mt-0.5">
                  {appliedCoupon === "FREEBELT" ? "Coupon Applied ✓" : "Code: FREEBELT"}
                </p>
              </div>
            </div>
          </div>
        </section>



        {/* PRIMARY CTA */}
        <div className="space-y-3 pt-4 border-t border-black/15">
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
              aria-label="Add to wishlist"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center border transition-all duration-200 cursor-pointer",
                isWishlisted
                  ? "border-black bg-black text-white"
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


          {/* COMMUNITY PROOF */}
          <div className="flex items-center justify-center gap-3 py-1 text-center">
            <div className="flex shrink-0 items-center -space-x-2.5">
              <div className="relative size-7 rounded-full overflow-hidden border border-white bg-black/10">
                <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="User avatar 1" className="h-full w-full object-cover" />
              </div>
              <div className="relative size-7 rounded-full overflow-hidden border border-white bg-black/10">
                <img src="https://randomuser.me/api/portraits/women/21.jpg" alt="User avatar 2" className="h-full w-full object-cover" />
              </div>
              <div className="relative size-7 rounded-full overflow-hidden border border-white bg-black/10">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar 3" className="h-full w-full object-cover" />
              </div>
              <div className="relative size-7 rounded-full overflow-hidden border border-white bg-black text-white text-[8px] font-bold uppercase flex items-center justify-center tracking-tighter">
                +99
              </div>
            </div>
            <div className="text-[11px] leading-tight text-left">
              <span className="font-bold text-black uppercase block tracking-wider">1,238+ Sold Today</span>
              <span className="text-black/50 uppercase text-[9px] tracking-wider">Loved by the Clarte Club community</span>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS ACCORDIONS */}
        <section id="details" className="border-t border-black/15 pt-4">
          <h2 className="text-[16px] sm:text-[18px] md:text-[22px] font-medium uppercase">
            Product Details
          </h2>
          {typeof product.detailsBody === "string" && product.detailsBody.includes("<") ? (
            <div
              className="mt-3 max-w-[36rem] font-sans text-[15px] sm:text-[16px] font-normal leading-[1.72] text-black/75 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-[14px] sm:[&_li]:text-[15px] [&_em]:italic [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: product.detailsBody }}
            />
          ) : (
            <p className="mt-3 max-w-[36rem] font-sans text-[16px] font-normal leading-[1.72] text-black/68">
              {product.detailsBody}
            </p>
          )}
        </section>

        <div className="space-y-4 border-t border-black/15 pt-3">
          <div className="border-b border-black/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
              className="flex w-full items-center justify-between text-[16px] sm:text-[18px] md:text-[22px] font-medium uppercase tracking-normal transition-opacity hover:opacity-70 cursor-pointer"
            >
              <span>Details &amp; Care</span>
              <span className="text-[16px] sm:text-[20px] font-light">{activeAccordion === "care" ? "−" : "+"}</span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                activeAccordion === "care" ? "max-h-[500px] mt-3" : "max-h-0"
              )}
            >
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] font-normal leading-relaxed text-black/68">
                {product.careNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-b border-black/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")}
              className="flex w-full items-center justify-between text-[16px] sm:text-[18px] md:text-[22px] font-medium uppercase tracking-normal transition-opacity hover:opacity-70 cursor-pointer"
            >
              <span>Shipping &amp; Payment</span>
              <span className="text-[16px] sm:text-[20px] font-light">{activeAccordion === "shipping" ? "−" : "+"}</span>
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                activeAccordion === "shipping" ? "max-h-[500px] mt-3" : "max-h-0"
              )}
            >
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] font-normal leading-relaxed text-black/68">
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
