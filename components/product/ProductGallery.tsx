"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ProductImage } from "@/components/product/productData"

export function ProductGallery({
  images,
}: {
  images: ProductImage[]
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full flex flex-col items-center justify-center p-8 text-center bg-[#F7F4EE] border border-black/5 rounded-[14px]">
        <span className="font-heading text-sm tracking-[0.25em] uppercase font-bold text-black/40">
          CLARTÉ CLUB
        </span>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#C9B07A] font-semibold mt-2">
          Image Upload Pending in Shopify
        </span>
      </div>
    )
  }

  const activeImage = images[activeImageIndex]

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index)
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const width = container.clientWidth
    if (width > 0) {
      const index = Math.round(container.scrollLeft / width)
      if (index !== activeImageIndex && index >= 0 && index < images.length) {
        setActiveImageIndex(index)
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:items-start w-full xl:sticky xl:top-6 self-start">
      {/* Desktop Vertical Thumbnail Column (Left side) */}
      <div className="hidden lg:flex lg:flex-col gap-2 w-[80px] shrink-0">
        {images.map((image, index) => {
          const isSelected = index === activeImageIndex
          return (
            <button
              key={`${image.src}-thumb-desk-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden bg-[#F7F4EE] transition-all duration-200 border cursor-pointer rounded-sm",
                isSelected
                  ? "border-black ring-1 ring-black"
                  : "border-black/5 opacity-70 hover:opacity-100 hover:border-black/20"
              )}
            >
              <Image
                src={image.src}
                alt={`View thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-contain object-center"
              />
            </button>
          )
        })}
      </div>

      {/* Mobile/Tablet Horizontal Swipeable Main Image Gallery (Hides on desktop) */}
      <div className="relative w-full aspect-[4/5] lg:hidden overflow-hidden border border-black/5 rounded-lg bg-[#F7F4EE]">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full h-full scroll-smooth"
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-main-mob-${index}`}
              className="relative w-full h-full shrink-0 snap-start bg-[#F7F4EE] flex items-center justify-center"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                style={
                  image.objectPosition
                    ? { objectPosition: image.objectPosition }
                    : undefined
                }
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>
        {/* Pagination indicator dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "size-1.5 rounded-full transition-all duration-200",
                index === activeImageIndex ? "bg-white w-3" : "bg-white/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop Main Image View (Hides on mobile/tablet) */}
      <figure className="hidden lg:block relative aspect-[4/5] w-full overflow-hidden bg-[#F7F4EE] flex-1 border border-black/5 rounded-lg">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          style={
            activeImage.objectPosition
              ? { objectPosition: activeImage.objectPosition }
              : undefined
          }
          className="object-contain object-center transition-all duration-300"
        />
      </figure>

      {/* Mobile Horizontal Thumbnail Strip (Below image on mobile) */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 mt-1 scrollbar-none scroll-smooth">
        {images.map((image, index) => {
          const isSelected = index === activeImageIndex
          return (
            <button
              key={`${image.src}-thumb-mob-${index}`}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-16 w-14 shrink-0 overflow-hidden bg-[#F7F4EE] transition-all duration-200 border cursor-pointer rounded-sm",
                isSelected
                  ? "border-black ring-1 ring-black"
                  : "border-black/5 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image.src}
                alt={`View thumbnail ${index + 1}`}
                fill
                sizes="56px"
                className="object-contain object-center"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
