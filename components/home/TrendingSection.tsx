"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, Plus, ShoppingBag } from "lucide-react"

import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal"
import {
  featuredProduct,
  trendingProducts,
  type ProductCard,
} from "@/components/product/productData"
import { addToCart, buyNow } from "@/lib/cart"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const eyewearDetails = { shape: "Round", lens: "UV400" }

export function ProductCardView({
  product,
  expanded = false,
  theme = "light",
  index = 0,
  verticalNavigation = false,
}: {
  product: ProductCard
  expanded?: boolean
  theme?: "light" | "dark"
  index?: number
  verticalNavigation?: boolean
}) {
  const isDark = theme === "dark"
  const gallery = product.gallery && product.gallery.length > 0 
    ? product.gallery 
    : (product.image ? [product.image] : [])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"up" | "down">("up")
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  // Preload all gallery images in background to eliminate black screens/flickers
  useEffect(() => {
    if (!gallery || gallery.length <= 1) return
    gallery.forEach((url) => {
      if (url) {
        const img = new window.Image()
        img.src = url
      }
    })
  }, [gallery])

  useEffect(() => {
    const resetBuying = () => setIsBuying(false)
    window.addEventListener("pageshow", resetBuying)
    window.addEventListener("focus", resetBuying)
    return () => {
      window.removeEventListener("pageshow", resetBuying)
      window.removeEventListener("focus", resetBuying)
    }
  }, [])

  // Touch Swipe Gesture State
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // Prevent vertical page scrolling when swiping vertically on the product card
  useEffect(() => {
    if (!verticalNavigation) return
    const el = imageContainerRef.current
    if (!el) return

    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const deltaX = Math.abs(currentX - startX)
      const deltaY = Math.abs(currentY - startY)

      // If user is dragging vertically to change images, prevent default page scrolling!
      if (deltaY > deltaX && deltaY > 6) {
        if (e.cancelable) {
          e.preventDefault()
        }
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })

    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
    }
  }, [verticalNavigation])

  const activeImage = gallery[activeImageIndex] ?? product.image ?? ""
  const hasGalleryControls = gallery.length > 1

  const isTransitioningRef = useRef(false)

  const handlePreviousImage = () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setSlideDirection("down")
    setActiveImageIndex(
      (currentIndex) => (currentIndex - 1 + gallery.length) % gallery.length
    )
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 520)
  }

  const handleNextImage = () => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setSlideDirection("up")
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % gallery.length)
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 520)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current - touchEndY

    if (verticalNavigation) {
      // In vertical navigation (Curated Edits):
      // Vertical swipe cycles through images of this product (UP = next, DOWN = prev)
      // Horizontal swipe (left/right) is intentionally NOT handled here so it bubbles
      // to the parent carousel for switching between products!
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 20) {
        if (deltaY > 0) {
          handleNextImage()
        } else {
          handlePreviousImage()
        }
      }
    } else {
      // Standard horizontal gallery swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
        if (deltaX > 0) {
          handleNextImage()
        } else {
          handlePreviousImage()
        }
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    addToCart({
      id: product.id,
      merchandiseId: product.merchandiseId,
      image: product.image,
      alt: product.alt,
      title: product.name ?? "Signature Frame",
      size: "XS",
      price: product.price ?? "₹ 4,500",
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (isBuying) return
    setIsBuying(true)

    const timer = setTimeout(() => {
      setIsBuying(false)
    }, 4000)

    try {
      await buyNow({
        id: product.id,
        merchandiseId: product.merchandiseId,
        image: product.image,
        alt: product.alt,
        title: product.name ?? "Signature Frame",
        size: "XS",
        price: product.price ?? "₹ 4,500",
      })
    } catch (err) {
      console.error("Buy Now error:", err)
      clearTimeout(timer)
      setIsBuying(false)
    }
  }

  const productHref = product.href || (product.handle ? `/product/${product.handle}` : (product.id ? `/product/${product.id}` : "/products"))

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col w-full cursor-pointer"
    >
      {/* ── 1. Image Container (1:1 Square Aspect Ratio with Uploaded Studio White Background) ── */}
      <div
        ref={imageContainerRef}
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-[12px] sm:rounded-[14px] select-none shadow-xs bg-white border border-black/5",
          verticalNavigation ? "touch-pan-x" : "touch-pan-y"
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >

        <Link href={productHref} className="absolute inset-0 cursor-pointer z-0 overflow-hidden">
          {activeImage ? (
            <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
              <motion.div
                key={`${product.id}-${activeImageIndex}`}
                custom={slideDirection}
                initial={{
                  opacity: 0.95,
                  y: verticalNavigation ? (slideDirection === "up" ? "100%" : "-100%") : 0,
                  x: verticalNavigation ? 0 : (slideDirection === "up" ? "100%" : "-100%"),
                }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{
                  opacity: 0.95,
                  y: verticalNavigation ? (slideDirection === "up" ? "-100%" : "100%") : 0,
                  x: verticalNavigation ? 0 : (slideDirection === "up" ? "-100%" : "100%"),
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 size-full"
              >
                <Image
                  src={activeImage}
                  alt={product.alt || product.name || "Product"}
                  fill
                  sizes="(max-width: 640px) 74vw, (max-width: 1024px) 36vw, 25vw"
                  priority={index < 2}
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-[#18181b]">
              <span className="font-heading text-[11px] sm:text-[13px] tracking-[0.22em] uppercase font-bold text-black/40 dark:text-white/40">
                CLARTÉ CLUB
              </span>
              <span className="text-[9px] uppercase tracking-[0.15em] text-[#C9B07A] font-semibold mt-1">
                {product.name || "Signature Frame"}
              </span>
            </div>
          )}
        </Link>

        {/* Badge */}
        {product.badge ? (
          <span
            className="absolute left-2.5 top-2.5 z-10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase leading-none tracking-wider rounded-[4px] shadow-sm"
            style={{ background: "#C9B07A", color: "#0F0F10" }}
          >
            {product.badge}
          </span>
        ) : null}

        {/* Top Right Wishlist Heart Icon Button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={toggleWishlist}
          className="group/wish absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-10 flex size-7 sm:size-8 items-center justify-center bg-transparent border-0 shadow-none cursor-pointer transition-transform duration-200 hover:scale-115 active:scale-95"
        >
          <Heart
            className={`size-4 sm:size-4.5 transition-colors duration-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)] ${
              isWishlisted
                ? "fill-[#C9B07A] text-[#C9B07A]"
                : "fill-white text-white"
            }`}
          />
        </button>

        {/* Navigation Arrows for Horizontal Gallery (when not in vertical mode) */}
        {hasGalleryControls && !verticalNavigation ? (
          <>
            <button
              type="button"
              aria-label="Previous product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handlePreviousImage()
              }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden sm:flex size-8 items-center justify-center rounded-full backdrop-blur-xs opacity-0 -translate-x-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:scale-110 active:scale-95 cursor-pointer shadow-xs border ${
                isDark
                  ? "bg-black/50 hover:bg-black/80 text-white border-white/20"
                  : "bg-white/60 hover:bg-white/90 text-black border-black/15"
              }`}
            >
              <ArrowLeft className="size-3.5 sm:size-4 stroke-[2]" />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleNextImage()
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden sm:flex size-8 items-center justify-center rounded-full backdrop-blur-xs opacity-0 translate-x-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:scale-110 active:scale-95 cursor-pointer shadow-xs border ${
                isDark
                  ? "bg-black/50 hover:bg-black/80 text-white border-white/20"
                  : "bg-white/60 hover:bg-white/90 text-black border-black/15"
              }`}
            >
              <ArrowRight className="size-3.5 sm:size-4 stroke-[2]" />
            </button>
          </>
        ) : null}

        {/* Navigation Arrows for Vertical Gallery (Curated Edits Mode) */}
        {hasGalleryControls && verticalNavigation ? (
          <>
            <button
              type="button"
              aria-label="Previous product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handlePreviousImage()
              }}
              className={`absolute top-2.5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex size-7.5 items-center justify-center rounded-full backdrop-blur-xs opacity-0 -translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto hover:scale-110 active:scale-95 cursor-pointer shadow-xs border ${
                isDark
                  ? "bg-black/55 hover:bg-black/85 text-white border-white/20"
                  : "bg-white/65 hover:bg-white/95 text-black border-black/15"
              }`}
            >
              <ChevronUp className="size-4 stroke-[2.2]" />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleNextImage()
              }}
              className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex size-7.5 items-center justify-center rounded-full backdrop-blur-xs opacity-0 translate-y-2 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto hover:scale-110 active:scale-95 cursor-pointer shadow-xs border ${
                isDark
                  ? "bg-black/55 hover:bg-black/85 text-white border-white/20"
                  : "bg-white/65 hover:bg-white/95 text-black border-black/15"
              }`}
            >
              <ChevronDown className="size-4 stroke-[2.2]" />
            </button>
          </>
        ) : null}


        {/* Vertical Pagination Indicator (Curated Edits 2D Mode - Compact & Bottom-Right) */}
        {hasGalleryControls && verticalNavigation ? (() => {
          const dotsCount = Math.min(gallery.length, 3)
          const activeDot = activeImageIndex < dotsCount
            ? activeImageIndex
            : (activeImageIndex % dotsCount)

          return (
            <div className="absolute right-2.5 bottom-2.5 z-20 flex flex-col items-center gap-1 px-1 py-1.5 rounded-full bg-black/45 backdrop-blur-xs border border-white/15 pointer-events-auto select-none shadow-xs">
              {Array.from({ length: dotsCount }).map((_, idx) => {
                const isActive = idx === activeDot
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`View image ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setSlideDirection(idx > activeImageIndex ? "up" : "down")
                      setActiveImageIndex(idx)
                    }}
                    className="flex items-center justify-center p-0.5 cursor-pointer"
                  >
                    <span
                      className={`rounded-full transition-all duration-300 ${
                        isActive
                          ? "size-1.5 bg-white scale-110 shadow-xs"
                          : "size-1 bg-white/50 hover:bg-white/90"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          )
        })() : null}

        {/* Horizontal Carousel Pagination Dots (Standard Gallery Mode) */}
        {hasGalleryControls && !verticalNavigation ? (() => {
          const maxVisible = 4
          const total = gallery.length
          const windowStart = total > maxVisible
            ? Math.min(Math.max(0, activeImageIndex - 2), total - maxVisible)
            : 0
          const visibleCount = Math.min(total, maxVisible)
          const viewportWidth = visibleCount * 8 + (visibleCount - 1) * 4

          return (
            <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 z-10 flex items-center justify-center pointer-events-auto select-none">
              <div className="flex items-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                <div
                  className="overflow-hidden flex items-center"
                  style={{ width: `${viewportWidth}px` }}
                >
                  <div
                    className="flex items-center gap-1 transition-transform duration-300 ease-out shrink-0"
                    style={{ transform: `translateX(-${windowStart * 12}px)` }}
                  >
                    {gallery.map((_, idx) => {
                      const isEdgeLeft = total > maxVisible && idx === windowStart && windowStart > 0
                      const isEdgeRight = total > maxVisible && idx === windowStart + maxVisible - 1 && windowStart < total - maxVisible
                      const isShrunk = (isEdgeLeft || isEdgeRight) && idx !== activeImageIndex

                      return (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Go to slide ${idx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setSlideDirection(idx > activeImageIndex ? "up" : "down")
                            setActiveImageIndex(idx)
                          }}
                          className="flex size-2 shrink-0 items-center justify-center cursor-pointer"
                        >
                          <span
                            className={`rounded-full transition-all duration-300 ${
                              idx === activeImageIndex
                                ? "size-1.5 bg-white scale-110 shadow-xs"
                                : isShrunk
                                ? "size-1 bg-white/35 scale-75"
                                : "size-1 bg-white/50 hover:bg-white/90"
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })() : null}

      </div>

      {/* ── 2. Content Details Below Image (with Direct BUY NOW Action) ── */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
        <div className="min-w-0 flex-1">
          <Link href={productHref} className="block group/title">
            <h3
              className={`text-xs sm:text-[13px] font-semibold truncate transition-colors group-hover/title:text-[#C9B07A] ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {product.name ?? "Signature Frame"}
            </h3>
          </Link>
          <p
            className={`mt-0.5 text-[11px] font-medium ${
              isDark ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {product.price ? product.price.replace("₹", "RS.") : "RS. 4,500"}
          </p>
        </div>

        {/* Action Buttons: Direct BUY NOW + Quick Add (+) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label={`Buy now ${product.name ?? product.alt}`}
            disabled={isBuying}
            onClick={handleBuyNow}
            className={`h-7 sm:h-7.5 px-2.5 sm:px-3 rounded-[6px] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center border ${
              isDark
                ? "bg-white text-black hover:bg-[#C9B07A] hover:text-black border-white/20"
                : "bg-black text-white hover:bg-neutral-800 border-black"
            } disabled:opacity-50`}
          >
            {isBuying ? "..." : "BUY NOW"}
          </button>

          {/* Quick Add Plus Button */}
          <button
            type="button"
            aria-label="Add to cart"
            onClick={handleAddToCart}
            className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              added
                ? "text-emerald-500"
                : isDark
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
            title="Add to Cart"
          >
            {added ? (
              <Check className="size-4 animate-in zoom-in-50 duration-200 text-emerald-500" />
            ) : (
              <Plus className="size-4 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      <ProductQuickViewModal
        key={`${product.id}-${quickViewOpen ? "open" : "closed"}-${activeImageIndex}`}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        product={{
          id: product.id,
          merchandiseId: product.merchandiseId,
          slug: product.handle || product.id,
          editLabel: product.category?.toUpperCase() || "CLARTÉ CLUB",
          title: product.name?.toUpperCase() || "SIGNATURE FRAME",
          breadcrumb: [
            { label: "Homepage", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: product.name || "Product" },
          ],
          originalPrice: "",
          price: product.price || "₹ 4,500",
          sold: "1,238 Sold Today",
          rating: "4.8",
          description:
            product.alt ||
            "An architectural frame sculpted from premium bio-acetate with custom hardware and signature wire cores.",
          detailsBody:
            product.alt ||
            "Precision-sculpted bio-acetate frame with 100% UV400 protective lenses.",
          careNotes: [
            "Wipe lenses with the microfiber cleaning cloth.",
            "Store in the provided leather protective case.",
            "Avoid leaving in direct high heat.",
          ],
          shippingNotes: [
            "Standard delivery in 2-4 business days.",
            "Free exchange within 14 days.",
          ],
          colorName: "Glossy Black",
          colors: [
            { name: "Glossy Black", value: "#000000" },
            { name: "Royal Tortoise", value: "#6f5639" },
          ],
          sizes: product.sizes || [],
          gallery: gallery.map((src) => ({ src, alt: product.name || "Product" })),
          deliveryPerks: [
            { label: "Fast delivery", detail: "2-4 days", icon: "truck" },
            { label: "Easy exchange", detail: "14 days", icon: "exchange" },
            { label: "Secure checkout", detail: "COD available", icon: "shield" },
            { label: "Tracked shipping", detail: "Live updates", icon: "card" },
          ],
          completeLook: gallery.slice(0, 3).map((src) => ({ src, alt: product.name || "Product" })),
        }}
        gallery={gallery}
        initialImageIndex={activeImageIndex}
      />
    </motion.article>
  )
}

export function TrendingSection() {
  const [products, setProducts] = useState<ProductCard[]>([])

  useEffect(() => {
    let isMounted = true
    import("@/lib/shopify-adapter").then(({ getShopifyProducts }) => {
      getShopifyProducts(8).then((liveProducts) => {
        if (isMounted && liveProducts && liveProducts.length > 0) {
          setProducts(liveProducts)
        }
      })
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="new-drops" className="w-full bg-white px-2 sm:px-4 lg:px-6 pt-12 pb-4 text-black md:pt-16 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between text-center sm:text-left items-center sm:items-start px-0.5"
      >
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#C9B07A] mb-1">
            Fresh Arrivals
          </p>
          <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight">
            New Drops
          </h2>
        </div>
      </motion.div>

      <div className="mt-5 sm:mt-7 grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4 gap-y-4 sm:gap-y-6">
        {products.length === 0 ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={`skeleton-${idx}`}
              className="flex flex-col w-full animate-pulse"
            >
              <div className="relative aspect-square w-full rounded-[12px] sm:rounded-[14px] bg-neutral-100 border border-black/5" />
              <div className="mt-2.5 space-y-1.5 px-0.5">
                <div className="h-3.5 bg-neutral-100 rounded-sm w-3/4" />
                <div className="h-3 bg-neutral-100 rounded-sm w-1/3" />
              </div>
            </div>
          ))
        ) : (
          products.map((product, idx) => (
            <ProductCardView key={product.id} product={product} index={idx} />
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 flex justify-center"
      >
        <Link
          href="/collections"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[0.6875rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white font-medium"
        >
          View All Drops
        </Link>
      </motion.div>
    </section>
  )
}
