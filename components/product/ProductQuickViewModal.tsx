"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Star, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { ButtonHTMLAttributes } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ProductDetail } from "@/components/product/productData"
import { addToCart, buyNow } from "@/lib/cart"

type ProductQuickViewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDetail
  gallery: string[]
  initialImageIndex?: number
}

function QuickViewColorSwatches({
  colors,
  selectedColor,
  onSelectColor,
}: {
  colors: ProductDetail["colors"]
  selectedColor: string
  onSelectColor: (colorName: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {colors.map((color) => {
        const isSelected = color.name === selectedColor

        return (
          <button
            key={color.name}
            type="button"
            aria-pressed={isSelected}
            aria-label={`Select ${color.name}`}
            onClick={() => onSelectColor(color.name)}
            className={cn(
              "flex h-[32px] w-[64px] items-stretch justify-stretch bg-white transition-[box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45 cursor-pointer",
              isSelected
                ? "border-[2px] border-black p-[3px]"
                : "border border-black/10 p-0 hover:border-black/30"
            )}
          >
            <span
              className="block h-full w-full"
              style={{ backgroundColor: color.value }}
            />
          </button>
        )
      })}
    </div>
  )
}

function QuickViewSizeButton({
  active,
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex h-10 items-center justify-center border text-[12px] font-bold tracking-wider uppercase transition-[background-color,border-color,color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/45 cursor-pointer",
        active
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black hover:border-black hover:bg-black/[0.04]",
        "min-w-0 px-3",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProductQuickViewModal({
  open,
  onOpenChange,
  product,
  gallery,
  initialImageIndex = 0,
}: ProductQuickViewModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(() =>
    Math.min(initialImageIndex, Math.max(gallery.length - 1, 0))
  )
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[1] ?? product.sizes[0] ?? ""
  )
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle")
  const [isBuying, setIsBuying] = useState(false)

  const handleAddToCart = () => {
    setCartState("adding")
    addToCart({
      id: product.slug,
      merchandiseId: product.merchandiseId,
      image: product.gallery[0]?.src || "/images/products/product1.png",
      alt: product.gallery[0]?.alt || product.title,
      title: product.title,
      size: selectedSize || "XS",
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
        image: product.gallery[0]?.src || "",
        alt: product.gallery[0]?.alt || product.title,
        title: product.title,
        size: selectedSize || "XS",
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



  useEffect(() => {
    if (!open) {
      return
    }

    const { body, documentElement } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior
    const previousHtmlOverscrollBehavior = documentElement.style.overscrollBehavior

    body.style.overflow = "hidden"
    documentElement.style.overflow = "hidden"
    body.style.overscrollBehavior = "none"
    documentElement.style.overscrollBehavior = "none"

    return () => {
      body.style.overflow = previousBodyOverflow
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overscrollBehavior = previousBodyOverscrollBehavior
      documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior
    }
  }, [open])

  const galleryImages =
    gallery.length > 0 ? gallery : product.gallery.map((image) => image.src)

  const activeImage =
    galleryImages[activeImageIndex] ?? galleryImages[0] ?? product.gallery[0]?.src

  const handlePreviousImage = () => {
    if (galleryImages.length === 0) {
      return
    }

    setActiveImageIndex(
      (currentIndex) =>
        (currentIndex - 1 + galleryImages.length) % galleryImages.length
    )
  }

  const handleNextImage = () => {
    if (galleryImages.length === 0) {
      return
    }

    setActiveImageIndex((currentIndex) => (currentIndex + 1) % galleryImages.length)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/80 backdrop-blur-[1px]"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className="!gap-0 !w-[min(96vw,956px)] !max-w-none max-h-[calc(100dvh-1.25rem)] overflow-hidden rounded-none border-0 bg-white p-0 text-black ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">{product.title} quick view</DialogTitle>
        <DialogDescription className="sr-only">
          Quick view dialog for {product.title}
        </DialogDescription>

        <div className="grid h-[min(88dvh,520px)] grid-cols-1 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <div className="relative min-h-[360px] bg-[#F6F2EA] lg:min-h-0 flex items-center justify-center">
            {activeImage || product.gallery[0]?.src ? (
              <Image
                key={`${activeImage ?? ""}-${activeImageIndex}`}
                src={activeImage ?? product.gallery[0]?.src ?? ""}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-contain object-center p-4"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <span className="font-heading text-sm tracking-[0.25em] uppercase font-bold text-black/40">
                  CLARTÉ CLUB
                </span>
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#C9B07A] font-semibold mt-1">
                  Media Pending in Shopify
                </span>
              </div>
            )}

            {galleryImages.length > 1 ? (
              <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3 text-white">
                <button
                    type="button"
                    aria-label="Previous image"
                    onClick={handlePreviousImage}
                    className="inline-flex size-10 items-center justify-center text-white/90 transition-opacity hover:opacity-70"
                  >
                  <ChevronLeft className="size-7 stroke-[1.8]" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={handleNextImage}
                  className="inline-flex size-10 items-center justify-center text-white/90 transition-opacity hover:opacity-70"
                >
                  <ChevronRight className="size-7 stroke-[1.8]" />
                </button>
              </div>
            ) : null}

            <div className="absolute bottom-3 left-3 bg-white/75 px-2 py-1 text-[0.85rem] font-medium text-black">
              {galleryImages.length > 0 ? activeImageIndex + 1 : 1}/
              {galleryImages.length || 1}
            </div>
          </div>

          <div className="relative min-h-0 overflow-hidden px-5 py-3.5 sm:px-6 sm:py-3.5 lg:px-7 lg:py-4">
            <DialogClose asChild>
              <button
                type="button"
                aria-label="Close quick view"
                className="absolute right-4 top-3 inline-flex size-8 items-center justify-center text-[1.1rem] font-semibold leading-none text-black transition-opacity hover:opacity-70"
              >
                <X className="size-5 stroke-[2.1]" />
              </button>
            </DialogClose>

            <div className="space-y-4 pr-3">
              <div className="space-y-1">
                <p className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.22em] text-[#C9B07A]">
                  {product.editLabel}
                </p>
                <h2 className="font-heading text-[24px] sm:text-[32px] md:text-[38px] font-normal uppercase leading-[0.95] tracking-[-0.06em]">
                  {product.title}
                </h2>
              </div>

              {/* PRICE BLOCK */}
              <div className="space-y-1.5 border-b border-black/10 pb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[14px] sm:text-[16px] leading-none text-black/45 line-through">
                    {product.originalPrice}
                  </span>
                  <span className="font-heading text-[18px] sm:text-[22px] font-medium leading-none tracking-[-0.04em] text-black">
                    {product.price}
                  </span>
                  <span className="inline-flex items-center justify-center bg-black text-[#F6F2EA] px-2.5 py-1 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider leading-none">
                    1,238 Sold Today
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.06em] text-black/60 ml-auto">
                    <Star className="size-3.5 fill-[#f2a33c] text-[#f2a33c]" />
                    {product.rating}
                  </span>
                </div>
                <p className="text-[8px] sm:text-[9px] text-black/40 uppercase tracking-wider font-light">
                  INCL. OF ALL TAXES
                </p>
              </div>

              <p className="max-w-[36rem] font-sans text-[13px] sm:text-[15px] font-normal leading-[1.6] text-black/65">
                {product.description}{" "}
                <Link
                  href="/products#details"
                  className="font-semibold text-black underline underline-offset-4"
                >
                  See More....
                </Link>
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={cartState !== "idle" || isBuying}
                    className={cn(
                      "flex h-11 flex-1 items-center justify-center border border-black text-[13px] sm:text-[14px] font-medium uppercase tracking-[0.14em] transition-all duration-200 ease-out cursor-pointer",
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
                      "flex h-11 w-11 shrink-0 items-center justify-center border transition-all duration-200 cursor-pointer",
                      isWishlisted
                        ? "border-black bg-black text-white"
                        : "border-black/20 bg-white text-black hover:border-black"
                    )}
                  >
                    <Heart
                      className="size-4.5 transition-transform duration-200 active:scale-125"
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
                    "flex h-11 w-full items-center justify-center border border-black bg-black text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.14em] text-white transition-opacity duration-200 ease-out hover:bg-black/85 cursor-pointer shadow-sm active:scale-[0.99]",
                    isBuying && "opacity-50 pointer-events-none"
                  )}
                >
                  Buy Now
                </button>

              </div>

              <div className="pt-1 text-center">
                <Link
                  href="/products"
                  className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.12em] text-black/55 underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
