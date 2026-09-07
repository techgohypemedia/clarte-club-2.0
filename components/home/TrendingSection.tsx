"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronLeft, ChevronRight, Heart, Plus, ShoppingBag } from "lucide-react"

import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal"
import {
  featuredProduct,
  trendingProducts,
  type ProductCard,
} from "@/components/product/productData"
import { addToCart, buyNow } from "@/lib/cart"

const eyewearDetails = { shape: "Round", lens: "UV400" }

export function ProductCardView({
  product,
  expanded = false,
  theme = "light",
}: {
  product: ProductCard
  expanded?: boolean
  theme?: "light" | "dark"
}) {
  const isDark = theme === "dark"
  const defaultGallery = [
    product.image || "/images/products/product1.png",
    "/images/products/product2.png",
    "/images/products/product3.png",
    "/images/products/product4.png",
  ]
  const gallery = product.gallery && product.gallery.length > 1 ? product.gallery : defaultGallery
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  useEffect(() => {
    const resetBuying = () => setIsBuying(false)
    window.addEventListener("pageshow", resetBuying)
    window.addEventListener("focus", resetBuying)
    return () => {
      window.removeEventListener("pageshow", resetBuying)
      window.removeEventListener("focus", resetBuying)
    }
  }, [])

  // Touch Swipe Gesture State for Homepage Cards
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const activeImage = gallery[activeImageIndex] ?? product.image
  const hasGalleryControls = true

  const handlePreviousImage = () => {
    setActiveImageIndex(
      (currentIndex) => (currentIndex - 1 + gallery.length) % gallery.length
    )
  }

  const handleNextImage = () => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % gallery.length)
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
    const deltaY = Math.abs(touchStartY.current - touchEndY)

    // Trigger image slide if horizontal swipe is predominant (> 20px)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 20) {
      if (deltaX > 0) {
        handleNextImage()
      } else {
        handlePreviousImage()
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
    <article className="group relative flex flex-col w-full cursor-pointer">
      {/* ── 1. Image Container (Taller Portrait Height aspect-[1/1.45] + rounded-[14px] Corners + Touch Pan-Y) ── */}
      <div
        className={`relative aspect-[1/1.45] w-full overflow-hidden rounded-[14px] select-none shadow-xs touch-pan-y ${
          isDark ? "bg-[#18181b]" : "bg-neutral-100"
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link href={productHref} className="absolute inset-0 cursor-pointer z-0">
          <Image
            key={`${product.id}-${activeImageIndex}`}
            src={activeImage}
            alt={product.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badge */}
        {product.badge ? (
          <span
            className="absolute left-3 top-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-wider rounded-md shadow-md"
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
          className={`absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg shadow-sm border transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
            isWishlisted
              ? "bg-black text-[#C9B07A] border-[#C9B07A]"
              : isDark
              ? "bg-black/70 text-white border-white/10 hover:bg-black hover:text-white"
              : "bg-white/90 text-neutral-800 border-black/10 hover:bg-white hover:text-black"
          }`}
        >
          <Heart
            className={`size-4 transition-colors duration-200 ${
              isWishlisted
                ? "fill-[#C9B07A] text-[#C9B07A]"
                : isDark
                ? "fill-transparent text-white/90 stroke-[1.8]"
                : "fill-white/80 text-black stroke-[1.8]"
            }`}
          />
        </button>

        {/* Left & Right Gallery Navigation Arrows (Visible on Desktop Hover) */}
        {hasGalleryControls ? (
          <>
            <button
              type="button"
              aria-label="Previous product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handlePreviousImage()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex size-9 items-center justify-center rounded-full bg-white/75 text-black backdrop-blur-md opacity-0 -translate-x-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 cursor-pointer shadow-sm border border-black/5"
            >
              <ArrowLeft className="size-4 stroke-[1.8]" />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleNextImage()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex size-9 items-center justify-center rounded-full bg-white/75 text-black backdrop-blur-md opacity-0 translate-x-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto hover:bg-white hover:scale-110 active:scale-95 cursor-pointer shadow-sm border border-black/5"
            >
              <ArrowRight className="size-4 stroke-[1.8]" />
            </button>
          </>
        ) : null}

        {/* Carousel Pagination Dots (. . .) */}
        {hasGalleryControls ? (
          <div className="absolute bottom-3 inset-x-0 z-10 flex items-center justify-center pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveImageIndex(idx)
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeImageIndex
                      ? "w-3.5 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Buy Now Button on Image Hover */}
        <button
          type="button"
          aria-label={`Buy now ${product.name ?? product.alt}`}
          disabled={isBuying}
          onClick={handleBuyNow}
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center px-5 py-2.5 rounded-full backdrop-blur-md text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-md cursor-pointer disabled:opacity-60 ${
            isDark
              ? "bg-white text-black hover:bg-[#C9B07A] hover:text-black border border-white/30"
              : "bg-black/90 text-white hover:bg-black border border-white/20"
          }`}
        >
          {isBuying ? "Processing..." : "Buy Now"}
        </button>
      </div>

      {/* ── 2. Content Details Below Image ── */}
      <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
        <div className="min-w-0 flex-1">
          <Link href={productHref} className="block group/title">
            <h3
              className={`text-xs sm:text-[13px] font-semibold truncate transition-colors group-hover/title:text-[#C9B07A] ${
                isDark ? "text-[#F6F2EA]" : "text-black"
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

        {/* Shopping Bag Cart Button */}
        <button
          type="button"
          aria-label="Add to cart"
          onClick={handleAddToCart}
          className={`flex shrink-0 items-center justify-center p-1.5 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
            added
              ? "text-emerald-500"
              : isDark
              ? "text-white/80 hover:text-[#C9B07A]"
              : "text-black hover:text-[#C9B07A]"
          }`}
          title="Add to Cart"
        >
          {added ? (
            <Check className="size-4 animate-in zoom-in-50 duration-200 text-emerald-500" />
          ) : (
            <ShoppingBag className="size-4 stroke-[1.8]" />
          )}
        </button>
      </div>

      <ProductQuickViewModal
        key={`${product.id}-${quickViewOpen ? "open" : "closed"}-${activeImageIndex}`}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        product={featuredProduct}
        gallery={gallery}
        initialImageIndex={activeImageIndex}
      />
    </article>
  )
}

export function TrendingSection() {
  const [products, setProducts] = useState<ProductCard[]>(trendingProducts)

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
    <section id="new-drops" className="w-full bg-white px-4 pt-14 pb-4 text-black sm:px-6 lg:px-8 md:pt-16 md:pb-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between text-center sm:text-left items-center sm:items-start">
        <div className="flex flex-col items-center sm:items-start">
          <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#C9B07A] mb-1">
            Fresh Arrivals
          </p>
          <h2 className="font-heading text-[22px] sm:text-3xl md:text-[40px] font-semibold uppercase leading-none tracking-tight">
            New Drops
          </h2>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCardView key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/collections"
          className="inline-flex h-9 items-center justify-center border border-black px-5 text-[0.6875rem] uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white font-medium"
        >
          View All Drops
        </Link>
      </div>
    </section>
  )
}
