"use client"

import type { ProductImage, ProductHighlightItem } from "@/components/product/productData"

type ProductHighlightsProps = {
  productTitle?: string
  gallery?: ProductImage[]
  highlights?: ProductHighlightItem[]
}

export function ProductHighlights({
  productTitle = "Signature Frame",
  gallery = [],
  highlights = [],
}: ProductHighlightsProps) {
  // Strategy: Take the last 4 pictures in sequence from Shopify product media
  const highlightImages = gallery.length >= 4 ? gallery.slice(-4) : gallery

  const img1 = highlightImages[0]?.src || "/images/products/product13.png"
  const img2 = highlightImages[1]?.src || "/images/products/product7.png"
  const img3 = highlightImages[2]?.src || "/images/products/product4.png"
  const img4 = highlightImages[3]?.src || highlightImages[0]?.src || "/images/products/product2.png"

  const defaultRows = [
    {
      id: "row-1",
      imagePosition: "left" as const,
      eyebrow: "LIMITED EDITION",
      title: "Rimless. Limitless.",
      description:
        "Clarity in its purest form. Clean lines, refined engineering, and an ultra-light profile create a timeless silhouette that lets your individuality take center stage.",
      imageSrc: img1,
      imageAlt: `${productTitle} - Rimless Limitless Floating Silhouette`,
    },
    {
      id: "row-2",
      imagePosition: "right" as const,
      eyebrow: "PRECISION ENGINEERING",
      title: "Featherlight Construction",
      description:
        "Crafted with a precision metal body and rimless silhouette. The frame offers exceptional lightness, lasting comfort, and effortless wear throughout the day.",
      imageSrc: img2,
      imageAlt: `${productTitle} - Featherlight Construction Temple Tip`,
    },
    {
      id: "row-3",
      imagePosition: "left" as const,
      eyebrow: "DETAILED DESIGN",
      title: "6 Stellar Stars",
      description:
        "Six stars rest on every temple — a signature detail honoring memorable milestones of craft. A quiet reminder of the architectural precision and dedication that brought us here.",
      imageSrc: img3,
      imageAlt: `${productTitle} - 6 Stellar Stars Hardware Engraving`,
    },
    {
      id: "row-4",
      imagePosition: "right" as const,
      eyebrow: "CUSTOM HARDWARE",
      title: "Refined Craftsmanship",
      description:
        "The finely sculpted nose-bridge reflects meticulous craftsmanship, creating a seamless balance between minimalist design and exceptional ergonomic comfort.",
      imageSrc: img4,
      imageAlt: `${productTitle} - Refined Craftsmanship Sculpted Bridge`,
    },
  ]

  // If custom metafield highlights exist in Shopify, merge them; otherwise use curated defaults
  const highlightRows = defaultRows.map((defRow, index) => {
    const custom = highlights?.[index]
    return {
      ...defRow,
      eyebrow: custom?.eyebrow || defRow.eyebrow,
      title: custom?.title || defRow.title,
      description: custom?.description || defRow.description,
      imageSrc: custom?.imageSrc || defRow.imageSrc,
      imageAlt: custom?.imageAlt || defRow.imageAlt,
    }
  })

  return (
    <section className="w-full bg-white border-t border-black/10 text-[#0F0F10]">
      {/* Editorial Section Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-20 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center space-y-1.5 sm:space-y-2">
        <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9B07A]">
          CRAFTSMANSHIP &amp; ARCHITECTURE
        </p>
        <h2 className="font-heading text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0F0F10]">
          Product Highlights
        </h2>
        <div className="mx-auto h-[1px] w-12 bg-black/15 mt-2 sm:mt-3" />
      </div>

      {/* 4 Alternating Feature Rows: Side-by-Side 2-Column on Mobile & Desktop */}
      <div className="w-full border-t border-b border-black/10 max-w-[1440px] mx-auto">
        {highlightRows.map((row, index) => {
          const isImageLeft = row.imagePosition === "left"
          const isNotLast = index < highlightRows.length - 1

          return (
            <div
              key={row.id}
              className={`grid grid-cols-2 items-center ${
                isNotLast ? "border-b border-black/10" : ""
              }`}
            >
              {/* Left Column */}
              <div
                className={`relative w-full overflow-hidden border-r border-black/10 ${
                  isImageLeft
                    ? "bg-white"
                    : "flex flex-col justify-center px-3.5 xs:px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 xs:py-6 sm:py-10 md:py-14 bg-white self-stretch"
                }`}
              >
                {isImageLeft ? (
                  /* Image on Left - Full Bleed Side by Side */
                  <div className="relative w-full h-auto overflow-hidden group bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.imageSrc}
                      alt={row.imageAlt}
                      className="w-full h-auto max-h-[640px] object-cover block group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
                  </div>
                ) : (
                  /* Text on Left */
                  <div className="space-y-1.5 xs:space-y-2 sm:space-y-3.5 max-w-lg my-auto">
                    <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.22em] text-[#C9B07A]">
                      {row.eyebrow}
                    </p>
                    <h3 className="font-heading text-[13px] xs:text-[15px] sm:text-2xl md:text-3xl lg:text-[38px] font-extrabold uppercase leading-[1.12] sm:leading-[1.1] tracking-tight text-[#0F0F10]">
                      {row.title}
                    </h3>
                    <p className="font-sans text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13px] lg:text-[14px] leading-[1.45] sm:leading-relaxed text-[#0F0F10]/70 font-light">
                      {row.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div
                className={`relative w-full overflow-hidden ${
                  !isImageLeft
                    ? "bg-white"
                    : "flex flex-col justify-center px-3.5 xs:px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-4 xs:py-6 sm:py-10 md:py-14 bg-white self-stretch"
                }`}
              >
                {!isImageLeft ? (
                  /* Image on Right - Full Bleed Side by Side */
                  <div className="relative w-full h-auto overflow-hidden group bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.imageSrc}
                      alt={row.imageAlt}
                      className="w-full h-auto max-h-[640px] object-cover block group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
                  </div>
                ) : (
                  /* Text on Right */
                  <div className="space-y-1.5 xs:space-y-2 sm:space-y-3.5 max-w-lg my-auto">
                    <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.22em] text-[#C9B07A]">
                      {row.eyebrow}
                    </p>
                    <h3 className="font-heading text-[13px] xs:text-[15px] sm:text-2xl md:text-3xl lg:text-[38px] font-extrabold uppercase leading-[1.12] sm:leading-[1.1] tracking-tight text-[#0F0F10]">
                      {row.title}
                    </h3>
                    <p className="font-sans text-[9.5px] xs:text-[10.5px] sm:text-xs md:text-[13px] lg:text-[14px] leading-[1.45] sm:leading-relaxed text-[#0F0F10]/70 font-light">
                      {row.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
